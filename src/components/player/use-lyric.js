// 歌词相关
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '../../service/song'
import Lyric from 'lyric-parser' // 歌词解析

export default function useLyric() {
  const currentLyric = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  // 切换歌曲时获取歌词
  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', { song: newSong, lyric })

    // 切换歌曲的过程中再次切换歌曲，则终止首次加载歌词的流程
    if (currentSong.value.lyric !== lyric) {
      return
    }

    currentLyric.value = new Lyric(lyric, handleLyric)

    console.log(lyric)
  })

  // 歌词每行切换时执行
  function handleLyric() { }
}
