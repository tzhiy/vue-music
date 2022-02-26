// 侧边导航栏的点击和滑动跳转操作
import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)

  // 获取每一组的标题构成数组
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  const touch = {} // 记录点击的信息

  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index) // 当前索引
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex // 开始索引

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY

    const delta = Math.floor((touch.y2 - touch.y1) / ANCHOR_HEIGHT) // 滑动停止到开始的坐标差
    const anchorIndex = touch.anchorIndex + delta // 目标索引

    scrollTo(anchorIndex)
  }

  // 跳转到
  function scrollTo(index) {
    // 解决点击到字母外的 div 容器的情况
    if (isNaN(index)) {
      return
    }
    // 限制 index 在 0 到 shortcutList.value.length - 1 之间
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index] // 当前索引对应的 dom 元素
    const scroll = scrollRef.value.scroll // 获得 use-scroll 中返回的 scroll 实例
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    scrollRef
  }
}
