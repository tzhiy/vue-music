import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const debug = process.env.NODE_ENV !== 'production' // 是否是开发环境

export default createStore({
  state,
  mutations,
  actions,
  getters,
  strict: debug, // 开发环境使用严格模式，深度 watch state 变化是否是通过提交 mutations
  plugins: debug ? [createLogger()] : [] // 开发环境使用 createLogger 插件
})
