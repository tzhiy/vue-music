<template>
  <div class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16 // 按钮的宽度

export default {
  name: 'progress-bar',
  emits: ['progress-changing', 'progress-changed'],
  props: {
    // 已经播放的进度，范围 [0, 1]
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      offset: 0 // 进度条偏移量
    }
  },
  computed: {
    progressStyle() {
      return `width:${this.offset}px`
    },
    btnStyle() {
      return `transform:translate3d(${this.offset}px,0,0)`
    }
  },
  watch: {
    progress(newProgress) {
      this.setOffset(newProgress)
    }
  },
  created() {
    // 无需响应式，优化性能
    this.touch = {} // 保存滑动信息
  },
  methods: {
    onTouchStart(e) {
      this.touch.x1 = e.touches[0].pageX
      this.touch.beginWidth = this.$refs.progress.clientWidth // 进度条滑动前的宽度
    },
    onTouchMove(e) {
      // 修改进度条
      const delta = e.touches[0].pageX - this.touch.x1 // 横坐标偏移
      const tempWidth = this.touch.beginWidth + delta // 滑动后的宽度
      const barWidth = this.$el.clientWidth - progressBtnWidth // 进度条的总长度
      const progress = Math.min(1, Math.max(0, tempWidth / barWidth))
      this.offset = barWidth * progress // 计算出偏移量

      // 修改播放进度
      this.$emit('progress-changing', progress)
    },
    onTouchEnd() {
      const barWidth = this.$el.clientWidth - progressBtnWidth // 进度条的总长度
      const progress = this.$refs.progress.clientWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    onClick(e) {
      const rect = this.$el.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left // 进度条偏移距离
      const barWidth = this.$el.clientWidth - progressBtnWidth // 进度条的总长度
      const progress = offsetWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    setOffset(progress) {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      this.offset = barWidth * progress
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
