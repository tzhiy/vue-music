import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

// 已在 base.css 中定义 g-relative 类为相对定位
const relativeCls = 'g-relative'

export default function createLoadingLikeDirective(Comp) {
  return {
    // el 是指令作用的组件对象，binding 是指令的值
    mounted(el, binding) {
      // 创建组件对应的 dom，动态挂载到 el 上
      const app = createApp(Comp)
      // 组件的实例
      const instance = app.mount(document.createElement('div'))
      // 获取组件的名称
      const name = Comp.name
      // 创建对象相应的属性
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance

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
      const name = Comp.name
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }

      // binding 的值改变时，进行判断
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el) {
    const name = Comp.name
    // 将挂载到的元素样式设置 postion 属性为非 static
    // getComputedStyle 用于获取元素属性
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    // el.instance 组件实例，el.instance.$el 组件 dom 对象
    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
    // Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
    // 由于在同一个元素上使用了 v-loading 和 v-no-result 两个指令
    // v-no-result 创建的实例会覆盖掉 v-loading 创建的实例赋值的 el.instance
    // 导致 v-loading 想要移除元素时找不到自己的实例对应的元素
    // 这里将 el 添加一个维度，通过指令的名称来找到自己的实例对象
  }
}
