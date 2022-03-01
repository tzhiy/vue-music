import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '../../assets/js/array-store'
import { FAVORITE_KEY } from '../../assets/js/constant'

export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100

  // 根据是否在收藏列表中返回相应图标
  function getFavoriteSong(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 切换收藏状态
  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      // 从 localStorage 保存的数组中移除
      list = remove(FAVORITE_KEY, compare)
    } else {
      // 保存到 localStorage 的数组中
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)

    // 自定义查找函数，用于找到与 song.id 对应的歌曲
    function compare(item) {
      return item.id === song.id
    }
  }

  // 判断歌曲是否在 favoriteList 列表中
  function isFavorite(song) {
    // findIndex 自定义查找规则
    return favoriteList.value.findIndex((item) => {
      return item.id === song.id
    }) > -1
  }

  return {
    getFavoriteSong,
    toggleFavorite
  }
}
