<template>
  <div class="recommend">
    <div class="slider-wrapper">
      <div class="slider-content">
        <slider v-if="sliders && sliders.length" :sliders="sliders" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider/slider.vue'

export default {
  name: 'recommend',
  components: {
    Slider
  },
  setup() {
    const sliders = ref([])
    onMounted(async () => {
      const result = await getRecommend()
      sliders.value = result.sliders
    })
    return {
      sliders
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .slider-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 40%;
    overflow: hidden;
    .slider-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
