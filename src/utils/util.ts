export const isPc = () => {
  if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) return false
  return true
}

// 利用 CSS3 旋转 对根容器逆时针旋转 90 度
export const detectOrient = () => {
  const width = document.documentElement.clientWidth
  const height = document.documentElement.clientHeight
  const wrapper: HTMLHtmlElement | null = document.querySelector('html')
  let style = ''
  if (width >= height) { // 横屏
    style = `${style}width:${width}px;`
    style = `${style}height:${height}px;`
    style = `${style}-webkit-transform: rotate(0); transform: rotate(0);`
    style = `${style}-webkit-transform-origin: 0 0;`
    style = `${style}transform-origin: 0 0;`
  } else { // 竖屏
    style = `${style}width:${height}px;`
    style = `${style}height:${width}px;`
    style = `${style}-webkit-transform: rotate(90deg); transform: rotate(90deg);`
    // 注意旋转中点的处理
    style = `${style}-webkit-transform-origin: ${width / 2}px ${width / 2}px;`
    style = `${style}transform-origin: ${width / 2}px ${width / 2}px;`
  }
  if (wrapper) wrapper.style.cssText = style
}
