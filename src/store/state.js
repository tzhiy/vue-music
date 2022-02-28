import { PLAY_MODE } from '../assets/js/constant'

const state = {
  sequenceList: [], // 顺序播放列表
  playlist: [], // 真实播放列表
  playing: false, // 正在播放
  playMode: PLAY_MODE.sequence, // 播放模式
  currentIndex: 0, // 当前播放索引
  fullScreen: false // 是否全屏
}

export default state
