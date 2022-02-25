// 通用的 dom 操作
export function addClass(el, className) {
  if (!el.className.contains(className)) {
    el.classList.add(className)
  }
}

export function removeClass(el, className) {
  el.classList.remove(className)
}
