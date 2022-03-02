import { ref } from 'vue'

// 中间交互逻辑
export default function useMiddleInteractive() {
  const currentShow = ref('cd') // 当前显示的组件 cd 或 lyric
  const middleLStyle = ref(null) // cd 的样式
  const middleRStyle = ref(null) // lyric 的样式

  const touch = {}

  // 从 cd 滑动时，currentShow 是 lyric，但是 currentView 还是 cd
  // currentShow 在过程中变化，currentView 在过程中不变，这样做防止在滑动时重复触发响应式
  let currentView = 'cd' // 即将显示的组件

  // 滑动操作的回调
  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = '' // 方向锁，防止斜着滑动
  }

  function onMiddleTouchMove(e) {
    const deltaX = e.touches[0].pageX - touch.startX // 滑动距离
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // 没有锁就设置锁
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v' // 锁住偏移量小的方向
    }

    // 如果是水平锁，不进行切换，直接返回
    if (touch.directionLocked === 'v') {
      return
    }

    const left = currentView === 'cd' ? 0 : -window.innerWidth // 根据当前的视图确定 lyric 偏移的初始值
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX)) // lyric 视图最终滑动的位移
    touch.percent = Math.abs(offsetWidth / window.innerWidth) // 滑动距离占屏幕宽度的比例

    // 根据滑动比例决定显示的视图
    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms' // 拖动过程中间隔为 0
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: '0ms'
    }
  }

  function onMiddleTouchEnd(e) {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }
    const duration = 300

    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
