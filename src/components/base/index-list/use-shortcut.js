import { computed } from 'vue'

export default function useShortcut(props) {
  // 获取每一组的标题构成数组
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  return {
    shortcutList
  }
}
