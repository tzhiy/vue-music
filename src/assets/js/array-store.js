// 数据存入 store 并永久存储
import storage from 'good-storage'

// 若数据不存在于数组中，插入数据
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

/**
 * 将 item 存入到 localStorage 中的 key 对应的数组中，通过 compare 函数确定是否已经存在
 * @param {*} item 要存入的 item
 * @param {*} key 要存入到的数组的 key
 * @param {*} compare 自定义查找规则
 * @param {*} maxLen 最大存储长度
 * @returns 存入后 key 所对应的数组
 */
export function save(item, key, compare, maxLen) {
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key) {
  return storage.get(key, [])
}
