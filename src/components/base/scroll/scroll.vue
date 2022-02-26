<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import useScroll from './use-scroll'

export default {
  name: 'scroll',
  // 对 scroll 的配置
  props: {
    click: {
      type: Boolean,
      default: true
    },
    // 决定是否派发 scroll 事件，可获得当前滚动轴的位置
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['scroll'],
  setup(props, { emit }) {
    const rootRef = ref(null)
    useScroll(rootRef, props, emit)

    return {
      rootRef
    }
  }
}
</script>
