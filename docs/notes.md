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
   
2. 完成歌手列表标题替换的动画

3. 实现快速导航入口

   + 右侧导航栏样式

   + 点击导航栏的字母转到对应的组

     使用 [BScroll 中的 scrollToElement 方法](https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-api.html#scrolltoelement-el-time-offsetx-offsety-easing)

   + 侧边导航栏的滑动跳转效果

     通过求 touchstart 和 touchmove 的纵坐标差计算

     处理边界情况

## 4 歌手详情页开发

1. 获取歌手详情页数据

   singer 数据传递：index-list.vue -> singer.vue -> singer-detail.vue

2. 获取歌手详情页歌曲 url

3. 歌手详情页组件

   + loading 效果
   + 推到顶部固定标题
   + 向下拉放大图片
   + 向上推模糊图片 backdrop-filter

4. 详情页支持刷新

   进入页面时，组件获取传递的参数进行数据渲染，但是刷新时无法获得参数，所以需要将数据保存到浏览器的本地存储中，使用 sessionStorage

5. 进入离开页面的过渡效果

   + https://v3.cn.vuejs.org/guide/transitions-enterleave.html
   + https://router.vuejs.org/zh/guide/advanced/transitions.html

6. 边界情况

   返回的数据为空的情况，创建类 v-loading 指令：将相同的操作封装成一个函数，抽离成单独的文件

   + 报错：不能移除不是子结点的结点
   + 分析：由于在同一个元素上使用了 v-loading 和 v-no-result 两个指令，v-no-result 创建的实例会覆盖掉 v-loading 创建的实例赋值的 el.instance，导致 v-loading 想要移除元素时找不到自己的实例对应的元素。
   + 解决：将 el 添加一个维度，通过指令的名称来找到自己的实例对象

7. 详情页点击

   判断运行环境 `process.env.NODE_ENV !== 'production'` 后使用 vuex 插件 createLogger 查看 state 的更新情况

8. 随机播放

   使用 [knuth shuffle](https://www.rosettacode.org/wiki/Knuth_shuffle) 算法实现随机播放

## 5 播放器内核组件开发

1. 基本样式和播放歌曲

2. 播放按钮的暂停和播放逻辑

3. 播放器前进与后退逻辑

4. 播放器 DOM 异常

   `DOMException: The play() request was interrupted by a new load request.`

   歌曲资源没加载完全时，执行 play 或切换歌曲更新 src，导致报错

   利用 canplay 事件判断歌曲是否加载完成，只有当加载完成才播放和切歌

5. 播放模式逻辑

   切换显示图标，修改全局状态的播放数组

6. 收藏功能逻辑

   刷新页面时显示收藏图标信息，构造持久存储的公共函数实现收藏过程

7. 进度条逻辑

   + 通过偏移量计算进度条的样式、`timeupdate` 获取播放时间、规范化时间格式
   + 进度条滑动 `touchstart`、`touchmove`、`touchend`
   + 播放时和滑动时进度条修改冲突
   + 支持点击进度条改变播放时间
   + 歌曲播放完毕跳转到下一首歌曲

8. 唱片旋转逻辑

   同步角度：当内层图片旋转暂停时，记录旋转角度添加到外层容器

9. 歌词逻辑

   + 切换歌曲时获取歌词
   + 前端缓存，不重复获取歌词
   + 实例化歌词对象，`timeupdate` 获取歌词播放时间
   + 歌词界面自动滚动，使用 BScroll API
   + 歌曲和歌词同步播放、暂停、进度条滑动
   + 解决切歌后歌词显示问题：清空上一首歌的歌词
   + 纯音乐情况
   + 唱片下方正在播放的歌词
   
10. 中间视图手指交互逻辑

   + 滑动一定距离切换唱片和歌词界面

