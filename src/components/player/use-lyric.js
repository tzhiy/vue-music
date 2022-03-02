// 歌词相关
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '../../service/song'
import Lyric from 'lyric-parser' // 歌词解析

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  // 切换歌曲时获取歌词，暂停上一首歌的歌词
  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }

    // 重置上一首歌的歌词
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0

    const date1 = new Date()
    const lyric = await getLyric(newSong)
    const date2 = new Date()
    console.log(date2 - date1)
    store.commit('addSongLyric', { song: newSong, lyric })

    // 切换歌曲的过程中再次切换歌曲，则终止首次加载歌词的流程
    if (currentSong.value.lyric !== lyric) {
      return
    }

    currentLyric.value = new Lyric(lyric, handleLyric)

    // 歌词获取成功后音频已经 ready 可播放歌词
    // 或歌词获取成功后等音频 ready 再触发歌词播放（在 player.vue 中）
    if (songReady.value) {
      playLyric()
    }

    console.log(lyric)
  })

  // 播放歌词
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // seek 当前播放时间
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // stop 暂停播放
      currentLyricVal.stop()
    }
  }

  // 歌词每行切换时执行
  function handleLyric({ lineNum }) {
    // 更新行号
    currentLineNum.value = lineNum

    // 后缀 -Comp 表示组件
    const scrollComp = lyricScrollRef.value
    // 后缀 -El 表示元素
    const listEl = lyricListRef.value

    // 若没有歌词，直接返回
    if (!listEl) {
      return
    }

    // 大于 7 行，则开始滚动
    if (lineNum > 7) {
      const lineEl = listEl.children[lineNum - 7]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    playLyric,
    lyricScrollRef,
    lyricListRef,
    stopLyric
  }
}
