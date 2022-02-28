// 自定义 v-loading 指令，v-loading:[binding.arg]='binding.value'
import Loading from './loading'
import createLoadingLikeDirective from '@/assets/js/create-loading-like-directive'

// 将创建指令过程封装到单独文件中，方便复用
const loadingDirective = createLoadingLikeDirective(Loading)

export default loadingDirective
