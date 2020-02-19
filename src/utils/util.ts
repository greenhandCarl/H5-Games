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

export class RandomPos {
  private existPos: Array<{x: number; y: number; radius: number}> = []
  private randomCount = 0
  private subject: { errRandom: number } = { errRandom: 0 }
  constructor () {
    this.existPos = []
  }

  getRandomNumberByRange (start: number, end: number) {
    return Math.floor(Math.random() * (end - start) + start)
  }

  getRandomPos (minX: number, maxX: number, minY: number, maxY: number, radius: number): {x: number; y: number } {
    this.randomCount = this.randomCount + 1
    const randomX = this.getRandomNumberByRange(minX, maxX)
    const randomY = this.getRandomNumberByRange(minY, maxY)

    let pass = true

    for (let i = 0; i < this.existPos.length; i++) {
      const pos = this.existPos[i]

      const distanceX = Math.abs(randomX - pos.x)
      const distanceY = Math.abs(randomY - pos.y)
      const distance = Math.floor(Math.sqrt(Math.pow(distanceY, 2) + Math.pow(distanceX, 2)))

      const tangentDistance = radius + pos.radius // 相切距离

      if (distance < tangentDistance) {
        pass = false
        break
      }
    }
    if (!pass) {
      if (this.randomCount > 2000) { // 如果获取随机数2000次都没有获取到不重叠的位置 则自定义位置
        this.subject.errRandom = this.subject.errRandom + 1
        return { x: minX + this.subject.errRandom * 50, y: minY - 50 }
      }
      return this.getRandomPos(minX, maxX, minY, maxY, radius)
    } else {
      this.existPos.push({ x: randomX, y: randomY, radius })
      return { x: randomX, y: randomY }
    }
  }
}
