<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <!-- 底部操作面板 -->
      <div class="bottom">
        <!-- 进度条 -->
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            ></progress-bar>
          </div>
          <span class="time time-r">{{
            formatTime(currentSong.duration)
          }}</span>
        </div>
        <!-- 切歌操作 -->
        <div class="operators">
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i
              @click="toggleFavorite(currentSong)"
              :class="getFavoriteSong(currentSong)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <!-- pause 音频播放停止，电脑待机睡眠时触发 -->
    <!-- canplay 当音频加载结束时触发 -->
    <!-- error 播放异常时触发 -->
    <!-- timeupdate 播放时触发，可获取播放时间 -->
    <!-- ended 播放完触发 -->
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import ProgressBar from './progress-bar'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'

export default {
  name: 'player',
  components: {
    ProgressBar
  },
  setup() {
    // data
    const audioRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0) // 当前歌曲播放时长
    let progressChanging = false

    // vuex
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const currentIndex = computed(() => store.state.currentIndex)
    const playlist = computed(() => store.state.playlist)
    const playMode = computed(() => store.state.playMode)

    // hooks
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteSong, toggleFavorite } = useFavorite()

    // computed
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })

    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })

    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration
    })

    // watch
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      currentTime.value = 0 // 切歌时，播放时间置 0
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    watch(playing, (newPlaying) => {
      // 只有当加载完成才播放
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    // methods
    function goBack() {
      store.commit('setFullScreen', false)
    }

    function togglePlay() {
      if (!songReady.value) {
        return
      }
      store.commit('setPlayingState', !playing.value)
    }

    function pause() {
      store.commit('setPlayingState', false)
    }

    function prev() {
      const list = playlist.value

      // 如果歌单没有歌或当前歌曲没有加载完成，禁止前进
      if (!songReady.value || list.length === 0) {
        return
      }
      // 如果只有一首歌，点击的时候重新播放
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        // 如果减为 -1，则播放最后一首
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
        // 如果点击的时候是暂停状态，则播放音乐
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }

    function next() {
      const list = playlist.value

      if (!songReady.value || list.length === 0) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }

    // 循环播放
    function loop() {
      debugger
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    function ready() {
      if (songReady.value) {
        return
      }
      songReady.value = true
    }

    function error() {
      // 异常时防止无法点击
      songReady.value = true
    }

    function updateTime(e) {
      // 没有滑动时才改变播放时间
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    // 滑动过程中只改变进度条和时间
    function onProgressChanging(progress) {
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
    }

    // 松手后改变歌曲播放时间点
    function onProgressChanged(progress) {
      currentTime.value = currentSong.value.duration * progress
      audioRef.value.currentTime = currentTime.value
      // 如果暂停则改为播放
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      progressChanging = false
    }

    function end() {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop() // 循环
      } else {
        next() // 播放下一首
      }
    }

    return {
      fullScreen,
      currentSong,
      audioRef,
      goBack,
      playIcon,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      disableCls,
      error,
      progress,
      currentTime,
      updateTime,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      end,
      // mode
      modeIcon,
      changeMode,
      // favorite
      getFavoriteSong,
      toggleFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
