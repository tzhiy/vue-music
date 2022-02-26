import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const scrollRef = ref(null)

  // 获取每一组的标题构成数组
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index) // 当前索引
    const targetEl = groupRef.value.children[anchorIndex] // 当前索引对应的 dom 元素
    const scroll = scrollRef.value.scroll // 获得 use-scroll 中返回的 scroll 实例
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    scrollRef
  }
}
