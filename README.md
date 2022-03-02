# vue-music

Vue 开发的音乐 App，提供流畅的音乐感受

## 技术栈

+ vue
+ vuex
+ vue-router
+ scss
+ [better-scroll](https://better-scroll.github.io/docs/zh-CN/guide)

## 开发说明

笔记与代码同步提交，笔记对应的代码可查看同一次 commit，[点击此处查看笔记](https://github.com/tzhiy/vue-music/blob/master/docs/notes.md)

### 结构树

```shell
└─src
    ├─assets // 静态资源
    │  ├─fonts // 字体资源
    │  ├─images // 图片资源
    │  ├─js // 通用 js 操作
    │  └─scss // 全局样式
    ├─components // 子组件
    │  ├─base // 基础组件
    │  │  ├─index-list
    │  │  ├─loading
    │  │  ├─no-result
    │  │  ├─scroll
    │  │  ├─slider
    │  │  └─song-list
    │  ├─header
    │  ├─music-list
    │  ├─player
    │  └─tab
    ├─router // 路由
    ├─service // 请求
    ├─store // 状态管理
    └─views // 页面组件
```

