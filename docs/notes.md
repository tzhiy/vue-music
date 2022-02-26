## 2 项目初始化和推荐页面

1. 样式文件

   variable.scss 和 mixin.scss 两个文件用于定义全局变量和 mixin，在使用时语义更强。它们并没有实体的样式，是在 scss 编译阶段使用的，在 css 中无效。

   在 index.scss 中，我们引入了除了这两个文件之外的其他**实体**样式文件。因为在这里引入全局变量和 mixin 这些非实体样式是无效的。

   我们可以在 vue.config.js 中修改 webpack 引入全局变量和 mixin。（需要修改 node-sass 和 sass-loader 到合适的版本）

2. [获取最新轮播图数据](https://github.com/ustbhuangyi/vue-music/issues/180)

3. [使用 BetterScroll](https://better-scroll.github.io/docs/zh-CN/guide/)

4. 在 setup 之前使用 async 之后，该组件变为异步组件，需要在调用该组件的外层包裹 [`<suspense>`标签](https://v3.cn.vuejs.org/guide/migration/suspense.html) 

5. Options API：结构清晰，逻辑少时代码清晰

   Composition API：使用的逻辑复杂可重用时更优

   在项目中可以同时使用两种 API，不影响性能

6. 由于 BetterScroll 需要在**初始化**时确定**父元素的高度大于子元素**才能进行滚动，我们首先需要设置父元素的高度，使其小于子元素；之后使用 ObserverDOM 监听 DOM 的更新，重新刷新 BetterScroll，解决 BetterScroll 初始化时要满足条件的问题

7. [使用 vue3-lazy 实现图片懒加载](https://github.com/ustbhuangyi/vue3-lazy)

8. 实现自定义指令 v-loading 实现 loading 效果

   + 指令的声明周期
   + 创建并挂载新的组件实例到元素上
   + 修改挂载元素的 class
   + 指令的动态参数


## 3 歌手页面开发

1. 歌手列表固定标题实现

   + 获取每一组歌手的高度

   + 获取当前 Y 值
