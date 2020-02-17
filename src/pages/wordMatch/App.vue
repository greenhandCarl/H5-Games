<template>
  <div id='app'>
    <div
      class='word'
      v-for='(item, index) in words'
      :key='index'
      :style='{...wordStyle, left: `${item.x}px`, top: `${item.y}px`}'
      @touchstart='onWordTouch(item)'
    >
      <span class='word-text' v-if='item.type === "text"'>
        {{item.content}}
      </span>
      <img class='word-img' v-if='item.type === "img"' :src='item.content' />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { RandomPos } from '@/utils/util'

interface Word {
  type: string;
  content: string;
  keyword: string;
}
@Component
export default class App extends Vue {
  words: Array<Word> = [
    { type: 'text', content: 'apple', keyword: 'apple' },
    { type: 'img', content: require('./imgs/apple.jpg'), keyword: 'apple' },
    { type: 'text', content: 'watermelon', keyword: 'watermelon' },
    { type: 'img', content: require('./imgs/watermelon.jpg'), keyword: 'watermelon' },
    { type: 'text', content: 'pears', keyword: 'pears' },
    { type: 'img', content: require('./imgs/pears.jpg'), keyword: 'pears' },
    { type: 'text', content: 'mango', keyword: 'mango' },
    { type: 'img', content: require('./imgs/mango.jpg'), keyword: 'mango' }
  ]

  wordWidth = 100
  wordHeight = 100
  prevTime = 0
  effectiveNum = 1000 // 有效时间段

  prevKeyword = ''

  wordStyle = {
    width: `${this.wordWidth}px`,
    height: `${this.wordHeight}px`,
    'line-height': `${this.wordHeight}px`
  }

  created () {
    this.initPos()
  }

  initPos () {
    let clientWidth = document.documentElement.clientWidth
    let clientHeight = document.documentElement.clientHeight
    if (clientWidth < clientHeight) { // 竖屏
      clientWidth = document.documentElement.clientHeight
      clientHeight = document.documentElement.clientWidth
    }
    const randomPos: RandomPos = new RandomPos(100)
    const halfWidth = this.wordWidth / 2
    const halfHeight = this.wordHeight / 2
    this.words = this.words.map(item => {
      const circleCenter = randomPos.getRandomPos(halfWidth, clientWidth - halfWidth, halfHeight, clientHeight - halfHeight)
      const pos = { x: circleCenter.x - halfWidth, y: circleCenter.y - halfHeight }
      return { ...item, ...pos }
    })
  }

  onWordTouch (word: Word) {
    const currentTime = new Date().getTime()
    if (
      this.prevTime > 0 &&
      currentTime - this.prevTime <= this.effectiveNum &&
      this.prevKeyword === word.keyword
    ) {
      this.onDisappear(word)
      this.prevKeyword = ''
      this.prevTime = 0 // 重置时间
    } else {
      this.prevKeyword = word.keyword
      this.prevTime = currentTime
    }
  }

  onDisappear (word: Word) {
    this.words = this.words.filter(item => item.keyword !== word.keyword)
    console.log('onDisappear')
  }
}
</script>

<style lang='scss'>
html,body {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .word {
    position: absolute;
    .word-text,
    .word-img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      text-align: center;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  }
}

</style>
