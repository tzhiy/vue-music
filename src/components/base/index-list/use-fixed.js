import { nextTick, ref, watch, computed } from 'vue'

export default function useFixed(props) {
  // data
  const groupRef = ref(null) // 列表的引用
  const listHeights = ref([]) // 每一列上方的高度数组，从 0 开始，到最后一列的底部结束
  const scrollY = ref(0) // 纵向滚动的值
  const currentIndex = ref(0) // 当前列表的索引

  // computed
  // 当前的 title
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value] // 当前的组
    return currentGroup ? currentGroup.title : ''
  })

  // watch
  watch(() => props.data, async () => {
    await nextTick() // nextTick 之后 dom 才发生变化
    calculate()
  })

  watch(scrollY, newY => {
    const listHeightsVal = listHeights.value

    // listHeightVal 长度比 list 的组数多 1，所以需要 -1
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]

      // Y 落在当前列表的区间内
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
      }
    }
  })

  // methods
  // 计算列表每组的高度数组
  function calculate() {
    const list = groupRef.value.children // 获取列表的子元素
    const listHeightsVal = listHeights.value
    let height = 0

    listHeightsVal.length = 0 // 清空数组
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  // pos 是滚动的坐标值
  function onScroll(pos) {
    // pos 的值从 0 开始到负值
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle
  }
}
