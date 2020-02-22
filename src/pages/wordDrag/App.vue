<template>
  <div id="app">
    <div class='answer'>
      <img
        :id='item.keyword'
        class='item'
        v-for='(item, index) in words'
        :key='index'
        :src='item.content'
        :style='item.style'
      />
    </div>
    <div class='option-container' >
      <img
        class='option'
        v-for='(item, index) in options'
        :key='index'
        :src='item.content'
        :style='{
          width: `${item.style.width}px`,
          height: `${item.style.height}px`,
          "padding-left": `${item.style.paddingLeft}px`,
          "padding-right": `${item.style.paddingRight}px`,
          "padding-right": `${item.style.paddingRight}px`,
          transform: `translate(${item.style.translateX}px, ${item.style.translateY}px) rotate(${item.style.rotate}deg)`
        }'
        @touchstart='onOptTouchStart(item, $event)'
        @touchend='onOptTouchEnd'
      />
    </div>
    <Record :totalTimeMs='6000' />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Record from '@/components/Record.vue'

interface Word {
  content: string;
  keyword: string;
  style?: { width: string; height: string; padding: string };
}
interface Option {
  content: string;
  keyword: string;
  style: {
    width: number;
    height: number;
    paddingLeft: number;
    paddingRight: number;
    translateX: number;
    translateY: number;
    rotate?: number;
  };
}
interface AreaMap {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  keyword: string;
}
@Component({
  components: { Record }
})
export default class App extends Vue {
  optStartX!: number
  optStartY!: number
  currentTranslateX!: number
  currentTranslateY!: number
  currentOption!: Option
  words: Array<Word> = [
    { content: require('./imgs/a-default.png'), keyword: 'a', style: { width: '50px', height: '50px', padding: '0 10px' } },
    { content: require('./imgs/p-default.png'), keyword: 'p0', style: { width: '50px', height: '46px', padding: '0 10px' } },
    { content: require('./imgs/p-default.png'), keyword: 'p1', style: { width: '50px', height: '46px', padding: '0 10px' } },
    { content: require('./imgs/le-default.png'), keyword: 'le', style: { width: '100px', height: '50px', padding: '' } }
  ]

  areaMaps: Array<AreaMap> = []

  options: Array<Option> = [
    {
      content: require('./imgs/a-active.png'),
      keyword: 'a',
      style: {
        width: 50,
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        translateX: -105,
        translateY: 6,
        rotate: -45
      }
    },
    {
      content: require('./imgs/p-active.png'),
      keyword: 'p0',
      style: {
        width: 50,
        height: 46,
        paddingLeft: 10,
        paddingRight: 10,
        translateX: 17,
        translateY: 58,
        rotate: 45
      }
    },
    {
      content: require('./imgs/p-active.png'),
      keyword: 'p1',
      style: {
        width: 50,
        height: 46,
        paddingLeft: 10,
        paddingRight: 10,
        translateX: 220,
        translateY: 10,
        rotate: 50
      }
    },
    {
      content: require('./imgs/le-active.png'),
      keyword: 'le',
      style: {
        width: 100,
        height: 50,
        paddingLeft: 0,
        paddingRight: 0,
        translateX: 50,
        translateY: -100,
        rotate: -60
      }
    }
  ]

  mounted () {
    this.initAreaMap()
  }

  initAreaMap () { // 字母区域
    this.areaMaps = this.options.map(item => {
      const dom: HTMLHtmlElement | null = document.querySelector(`#${item.keyword}`)
      const top = dom ? dom.getBoundingClientRect().top : 0
      const left = dom ? dom.getBoundingClientRect().left : 0
      const width = dom ? dom.getBoundingClientRect().width : 0
      const height = dom ? dom.getBoundingClientRect().height : 0
      const areaMap = {
        minX: left,
        maxX: left + width,
        minY: top,
        maxY: top + height,
        keyword: item.keyword
      }
      return areaMap
    })
  }

  onOptTouchStart (option: Option, e: TouchEvent) {
    const touch = e.touches[0]
    this.optStartX = touch.pageX
    this.optStartY = touch.pageY
    this.currentTranslateX = option.style.translateX
    this.currentTranslateY = option.style.translateY
    this.currentOption = option
    document.addEventListener('touchmove', this.onDocTouchMove)
  }

  onOptTouchEnd () {
    document.removeEventListener('touchmove', this.onDocTouchMove)
    document.addEventListener('touchend', this.onAnswerTouchEnd)
  }

  onAnswerTouchEnd (e: TouchEvent) {
    const touch = e.changedTouches[0]
    const currentX = touch.pageX
    const currentY = touch.pageY
    this.areaMaps.forEach(item => {
      if (
        item.maxX > currentX &&
        currentX > item.minX &&
        item.maxY > currentY &&
        currentY > item.minY
      ) {
        this.options = this.options.map(i => {
          if (i.keyword === item.keyword && this.currentOption.keyword === item.keyword) {
            const newItem = {
              ...i,
              style: {
                ...i.style,
                translateX: 0,
                translateY: 0,
                rotate: 0
              }
            }
            return newItem
          }
          return i
        })
      }
    })
  }

  onDocTouchMove (e: TouchEvent) {
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight
    const touch = e.touches[0]
    const currentX = touch.pageX
    const currentY = touch.pageY
    const disX = currentX - this.optStartX
    const disY = currentY - this.optStartY
    if (width >= height) {
      this.options = this.options.map(item => {
        if (item.keyword === this.currentOption.keyword) {
          const newOption = {
            ...item,
            style: {
              ...item.style,
              translateX: disX + this.currentTranslateX,
              translateY: disY + this.currentTranslateY
            }
          }
          return newOption
        }
        return item
      })
    } else {
      this.options = this.options.map(item => {
        if (item.keyword === this.currentOption.keyword) {
          const newOption = {
            ...item,
            style: {
              ...item.style,
              translateX: disY + this.currentTranslateX,
              translateY: -disX + this.currentTranslateY
            }
          }
          return newOption
        }
        return item
      })
    }
  }
}

</script>

<style lang="scss">
html,body {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
#app {
  position: relative;
  height: 100%;
  width: 100%;
  background-image: url('./imgs/bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  .answer {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
  }
  .option-container {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    .option {
      transform-origin: 50% 50%;
    }
  }
}
/* 横屏 */
@media screen and (orientation: landscape) {
}

</style>
