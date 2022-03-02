# vue-music

Vue 开发的音乐 App，提供流畅的音乐感受

## 技术栈

+ vue
+ vuex
+ vue-router
+ scss
+ [better-scroll](https://better-scroll.github.io/docs/zh-CN/guide)

## 如何运行

克隆代码后在本地运行服务

```
git clone https://github.com/tzhiy/vue-music.git
npm install
npm run serve
```

建议在手机端或电脑浏览器的手机模拟模式下体验

## 应用截图

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/087406ca57c54ca3a6691225a0b2b976~tplv-k3u1fbpfcp-watermark.image?" alt="singer.png" width="292" height="633" /><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/825603c54c2b4501ab7e5f4bcf2c47dd~tplv-k3u1fbpfcp-watermark.image?" alt="player.png" width="292" height="633" /><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c6387b9eba945419216819f3c01e0da~tplv-k3u1fbpfcp-watermark.image?" alt="lyric.png" width="292" height="633" />

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
