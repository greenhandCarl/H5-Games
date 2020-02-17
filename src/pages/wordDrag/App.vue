<template>
  <div id="app">
    <div class='countdown-container'><div class='bar'></div></div>
    <div class='img-box'></div>
    <div class='answer'>
      <span class='item' v-for='(item, index) in words' :key='index'>{{item.word}}</span>
    </div>
    <div class='option-container'>
      <div
        class='option'
        v-for='(item, index) in options'
        :key='index'
        @touchstart='onOptTouchStart'
        @touchend='onOptTouchEnd'
      >
        {{item}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

interface Word {
  word: string;
  unfinished: boolean;
}
@Component
export default class App extends Vue {
  optStartX!: number
  optStartY!: number
  currentTouchOpt!: HTMLHtmlElement
  words: Array<Word> = [
    { word: 'y', unfinished: false },
    { word: 'o', unfinished: false },
    { word: '_', unfinished: true }
  ]

  options: Array<string> = ['u', 'e', 'o']

  onOptTouchStart (e: any) {
    const touch = e.touches[0]
    this.optStartX = touch.pageX
    this.optStartY = touch.pageY
    this.currentTouchOpt = e.target
    document.addEventListener('touchmove', this.onDocTouchMove)
  }

  onOptTouchEnd () {
    document.removeEventListener('touchmove', this.onDocTouchMove)
  }

  onDocTouchMove (e: any) {
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight
    const touch = e.touches[0]
    const currentX = touch.pageX
    const currentY = touch.pageY
    const disX = currentX - this.optStartX
    const disY = currentY - this.optStartY
    if (width >= height && this.currentTouchOpt) {
      this.currentTouchOpt.style.webkitTransform = `translate(${disX}px, ${disY}px)`
      this.currentTouchOpt.style.transform = `translate(${disX}px, ${disY}px)`
    }
    if (width < height && this.currentTouchOpt) {
      this.currentTouchOpt.style.webkitTransform = `translate(${disY}px, ${-disX}px)`
      this.currentTouchOpt.style.transform = `translate(${disY}px, ${-disX}px)`
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
  background: skyblue;
  .countdown-container {
    height: 13.3333vw;
  }
  .img-box {
    height: 26vw;
  }
  .answer {
    text-align: center;
    .item {
      font-size: 40px;
      padding: 0 5px;
    }
  }
  .option-container {
    display: flex;
    font-size: 40px;
    align-items: center;
    justify-content: space-around;
    margin-top: 2.6666vw;
  }
}
/* 横屏 */
@media screen and (orientation: landscape) {
  #app {
    .countdown-container {
      height: 13.3333vh;
    }
    .img-box {
      height: 26vh;
    }
    .option-container {
      margin-top: 2.6666vh;
    }
  }
}

</style>
