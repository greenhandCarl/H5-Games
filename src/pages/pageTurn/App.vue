<template>
  <div id='app'>
    <div class='option-container'>
      <img
        v-for='(item, index) in options'
        :key='index'
        class='option'
        :src='item.content'
        :style='{
          width: `${normalSize.w * zoomRatio / 2}px`,
          height: `${normalSize.h * zoomRatio}px`,
          transform: `translate(${item.style.translateX}px, ${item.style.translateY}px)`
        }'
        @touchstart='onOptTouchStart(item, $event)'
      />
    </div>
    <div id='bookContainer' class='book-container'>
      <div
        class='book-box'
        :style='{
          backgroundSize: `${originSize.w * zoomRatio}px ${originSize.h * zoomRatio}px`,
          backgroundPosition: `${backgroundPosAry[pageStep]["x"] * zoomRatio}px ${backgroundPosAry[pageStep]["y"] * zoomRatio}px`,
          width: `${backgroundPosAry[pageStep]["w"] * zoomRatio}px`,
          height: `${backgroundPosAry[pageStep]["h"] * zoomRatio}px`
        }'
      >
      </div>
      <div
        id='turnContainer'
        class='turn-container'
        :style='{
          width: `${normalSize.w * zoomRatio}px`,
          height: `${normalSize.h * zoomRatio}px`,
          bottom: `${normalSize.b * zoomRatio}px`
        }'
      >
        <div
          class='left-back-page'
          :style='{
            width: `${normalSize.w * zoomRatio / 2}px`,
            height: `${normalSize.h * zoomRatio}px`,
            lineHeight: `${normalSize.h * zoomRatio}px`,
            display: turnAniAry[pageStep]["backRotateY"] > -60 ? "none" : "inline-block"
          }'
        >
          cat
        </div>
        <div
          class="right-front-page"
          :style='{
            width: `${normalSize.w * zoomRatio / 2}px`,
            height: `${normalSize.h * zoomRatio}px`,
            left: `${normalSize.w * zoomRatio / 2}px`,
            backgroundImage: `url("${rightFrontImg}")`,
            backgroundSize: `${normalSize.w * zoomRatio / 2}px ${normalSize.h * zoomRatio}px`,
            transform: turnAniAry[pageStep]["isFront"] && `rotateY(${turnAniAry[pageStep]["frontRotateY"]}deg) skewY(${turnAniAry[pageStep]["frontSkewY"]}deg)`,
            display: turnAniAry[pageStep]["isFront"] ? "inline-block" : "none"
          }'
        ></div>
        <div
          class="right-back-page"
          :style='{
            width: `${normalSize.w * zoomRatio / 2}px`,
            height: `${normalSize.h * zoomRatio}px`,
            lineHeight: `${normalSize.h * zoomRatio}px`,
            transform: !turnAniAry[pageStep]["isFront"] && `rotateY(${turnAniAry[pageStep]["backRotateY"]}deg) skewY(${turnAniAry[pageStep]["backSkewY"]}deg)`,
            display: turnAniAry[pageStep]["isFront"] ? "none" : "inline-block"
          }'
        >
          dog
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

interface BackgroundPos {
  w: number;
  h: number;
  x: number;
  y: number;
}
interface Option {
  keyword: string;
  content: string;
  style: {
    translateX: number;
    translateY: number;
  };
}
@Component
export default class App extends Vue {
  backgroundPosAry: Array<BackgroundPos> = [ // 背景图帧图
    { w: 464, h: 256, x: 0, y: -646 },
    { w: 464, h: 256, x: -462, y: -646 },
    { w: 464, h: 328, x: -464, y: 0 },
    { w: 464, h: 342, x: 0, y: 0 },
    { w: 464, h: 305, x: -464, y: -330 },
    { w: 464, h: 256, x: 0, y: -646 }
  ]

  turnAniAry = [ // h5模拟翻页
    { frontRotateY: 0, frontSkewY: 0, isFront: true },
    { frontRotateY: 10, frontSkewY: -5, isFront: true },
    { frontRotateY: 50, frontSkewY: -20, isFront: true },
    { backRotateY: -60, backSkewY: 22.5, isFront: false },
    { backRotateY: -20, backSkewY: 10, isFront: false },
    { backRotateY: 0, backSkewY: 0, isFront: false }
  ]

  normalSize = { // 正常一本书的尺寸
    w: 394,
    h: 236,
    b: 18
  }

  maxSize = { // 精灵图中最大的尺寸
    w: 464,
    h: 342
  }

  originSize = { // 背景图原始尺寸
    w: 925,
    h: 902
  }

  pageTimer = 0
  pageStep = 0
  zoomRatio = 1

  options: Array<Option> = [
    {
      keyword: 'cat',
      content: require('./imgs/cat.png'),
      style: {
        translateX: 0,
        translateY: 0
      }
    }
  ]

  currentOption!: Option
  currentTranslateX!: number
  currentTranslateY!: number

  optStartX!: number
  optStartY!: number

  area!: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }

  rightFrontImg = ''

  mounted () {
    this.setZoomRatio()
    this.initArea()
  }

  initArea () { // 初始化触发翻页范围
    const dom: HTMLHtmlElement | null = document.querySelector('#turnContainer')
    const top = dom ? dom.getBoundingClientRect().top : 0
    const left = dom ? dom.getBoundingClientRect().left : 0
    const width = dom ? dom.getBoundingClientRect().width : 0
    const height = dom ? dom.getBoundingClientRect().height : 0
    this.area = {
      minX: left + width / 2,
      maxX: left + width,
      minY: top,
      maxY: top + height
    }
  }

  setZoomRatio () {
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight
    const bookContainerDom: HTMLHtmlElement | null = document.querySelector('#bookContainer')
    if (bookContainerDom && width >= height) { // 横屏
      const height = bookContainerDom.getBoundingClientRect().height
      this.zoomRatio = height / this.maxSize.h
    }
    if (bookContainerDom && height > width) { // 竖屏
      const height = bookContainerDom.getBoundingClientRect().width
      this.zoomRatio = height / this.maxSize.h
    }
  }

  startTurnPage () {
    this.options = this.options.filter(item => item.keyword !== this.currentOption.keyword)
    this.rightFrontImg = require('./imgs/cat.png')
    this.toNextStatus()
  }

  toNextStatus () {
    clearTimeout(this.pageTimer)
    this.pageTimer = setTimeout(() => {
      if (this.pageStep < this.turnAniAry.length - 1) {
        this.pageStep += 1
        this.toNextStatus()
      }
    }, 200)
  }

  onOptTouchStart (option: Option, e: TouchEvent) {
    const touch = e.touches[0]
    this.optStartX = touch.pageX
    this.optStartY = touch.pageY
    this.currentTranslateX = option.style.translateX
    this.currentTranslateY = option.style.translateY
    this.currentOption = option
    document.addEventListener('touchmove', this.onDocTouchMove)
    document.addEventListener('touchend', this.onDocTouchEnd)
  }

  onDocTouchMove (e: TouchEvent) {
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight
    const touch = e.touches[0]
    const currentX = touch.pageX
    const currentY = touch.pageY
    const disX = currentX - this.optStartX
    const disY = currentY - this.optStartY
    if (width >= height) { // 横屏
      this.options = this.options.map(item => {
        if (item.keyword === this.currentOption.keyword) {
          return {
            ...item,
            style: {
              ...item.style,
              translateX: disX + this.currentTranslateX,
              translateY: disY + this.currentTranslateY
            }
          }
        }
        return item
      })
    } else {
      this.options = this.options.map(item => {
        if (item.keyword === this.currentOption.keyword) {
          return {
            ...item,
            style: {
              ...item.style,
              translateX: disY + this.currentTranslateX,
              translateY: -disX + this.currentTranslateY
            }
          }
        }
        return item
      })
    }
  }

  onDocTouchEnd (e: TouchEvent) {
    document.removeEventListener('touchmove', this.onDocTouchMove)
    const touch = e.changedTouches[0]
    const currentX = touch.pageX
    const currentY = touch.pageY
    if (
      this.area.maxX > currentX &&
      currentX > this.area.minX &&
      this.area.maxY > currentY &&
      currentY > this.area.minY
    ) {
      this.startTurnPage()
    }
    document.removeEventListener('touchmove', this.onDocTouchEnd)
  }
}
</script>

<style lang='scss'>
body,html {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  box-sizing: border-box;
}
#app {
  width: 100%;
  height: 100%;
  position: relative;
  .option-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 3;
  }
  .book-container {
    position: absolute;
    top: 50vw;
    left: 0;
    width: 100%;
    height: 40vw;
    .book-box {
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      background-image: url('./imgs/book.png');
      background-repeat: no-repeat;
    }
    .turn-container {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      .left-back-page {
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        font-size: 20px;
      }
      .right-front-page {
        position: absolute;
        top: 0;
        background-repeat: no-repeat;
        background-position: 0 0;
        transform-style: preserve-3d;
        transform-origin: 0 50%;
        z-index: 1;
      }
      .right-back-page {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        text-align: center;
        font-size: 20px;
        transform-style: preserve-3d;
        transform-origin: 100% 50%;
        display: none;
      }
    }
  }
}

/* 横屏 */
@media screen and (orientation: landscape) {
  #app {
    .book-container {
      top: 50vh;
      height: 40vh;
    }
  }
}
</style>
