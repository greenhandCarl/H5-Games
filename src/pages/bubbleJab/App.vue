<template>
  <div id='app'>
    <div class='sky'></div>
    <div class='sea'>
      <div class='whale'></div>
    </div>
    <div
      class='word'
      v-for='(item, index) in words'
      :key='index'
      :style='{
        ...wordStyle,
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.radius * 2}px`,
        height: `${item.radius * 2}px`,
        lineHeight: `${item.radius * 2}px`,
        backgroundColor: item.selected ? "red" : "#fff"
      }'
      @touchstart='onWordTouchStart(item)'
    >
      {{item.content}}
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { RandomPos } from '@/utils/util'

interface Word {
  content: string;
  id: string;
  selected: boolean;
}
@Component
export default class App extends Vue {
  words: Array<Word> = [
    { content: 'apple', id: '0', selected: false },
    { content: 'banana', id: '1', selected: false },
    { content: 'watermelon', id: '2', selected: false },
    { content: 'pears', id: '3', selected: false },
    { content: 'Mango', id: '4', selected: false },
    { content: 'orange', id: '5', selected: false },
    { content: 'pitaya', id: '6', selected: false },
    { content: 'Hamimelon', id: '7', selected: false }
  ]

  prevWord: Word = { content: '', id: '', selected: false }

  wordStyle = {
    position: 'absolute',
    border: '1px solid #000',
    'border-radius': '50%',
    'text-align': 'center'
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
    const showHeight = clientHeight - clientWidth * 5 / 100
    const randomPos: RandomPos = new RandomPos()
    this.words = this.words.map(item => {
      const randomRadius = randomPos.getRandomNumberByRange(30, 80)
      const circleCenter = randomPos.getRandomPos(randomRadius, clientWidth - randomRadius, randomRadius, showHeight - randomRadius, randomRadius)
      const pos = { x: circleCenter.x - randomRadius, y: circleCenter.y - randomRadius, radius: randomRadius }
      return { ...item, ...pos }
    })
  }

  onWordTouchStart (word: Word) {
    if (word.id === this.prevWord.id) {
      this.words = this.words.filter(item => item.id !== word.id)
    } else {
      this.words = this.words.map(item => {
        if (item.id === word.id) return { ...item, selected: true }
        return { ...item, selected: false }
      })
    }
    this.prevWord = word
  }
}
</script>

<style lang='scss'>
html,body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
  .sky {
    background-color: rgb(249, 242, 181);
    height: 20vw;
    width: 100%;
  }
  .sea {
    background-color: rgb(118, 187, 255);
    height: 80vw;
    width: 100%;
    .whale {
      width: 60vh;
      height: 10vh;
      position: absolute;
      left: 50%;
      bottom: -6vh;
      transform: translateX(-50%);
      background-color: rgb(78, 200, 216);
      border: 5px solid #000;
      border-top-left-radius: 25vh 5vh;
      border-top-right-radius: 25vh 5vh;
    }
  }
}
/* 横屏 */
@media screen and (orientation: landscape) {
  #app {
    .sky {
      height: 20vh;
    }
    .sea {
      position: relative;
      height: 80vh;
      .whale {
        width: 60vw;
        height: 10vw;
        bottom: -6vw;
        border-top-left-radius: 25vw 5vw;
        border-top-right-radius: 25vw 5vw;
      }
    }
  }
}
</style>
