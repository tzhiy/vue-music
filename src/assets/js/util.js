export function shuffle(source) {
  const arr = source.slice() // 不改变原始值
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

// 随机返回 [0, max] 的整数
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

function swap(arr, i, j) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}
