// 自定义 v-loading 指令，v-loading:[binding.arg]='binding.value'
import { createApp } from 'vue'
import Loading from './loading'
import { addClass, removeClass } from '../../../assets/js/dom'

// 已在 base.css 中定义 g-relative 类为相对定位
const relativeCls = 'g-relative'

// 将 loading 组件动态插入到指令对象上
// loading 值为 true 时生效
const loadingDirective = {
  // el 是 v-loading 作用的组件对象，binding 是 v-loading 的值
  mounted(el, binding) {
    // 创建组件对应的 dom，动态挂载到 el 上
    const app = createApp(Loading)
    // 组件的实例
    const instance = app.mount(document.createElement('div'))
    el.instance = instance

    // 传递给指令的动态参数
    const title = binding.arg
    if (typeof title !== 'undefined') {
      // 通过 instance 调用实例的 methods
      instance.setTitle(title)
    }

    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    const title = binding.arg
    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }

    // binding 的值改变时，进行判断
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el) {
  // 将挂载到的元素样式设置 postion 属性为非 static
  // getComputedStyle 用于获取元素属性
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  // el.instance 组件实例，el.instance.$el 组件 dom 对象
  el.appendChild(el.instance.$el)
}

function remove(el) {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
