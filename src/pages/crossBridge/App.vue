<template>
  <div id="app">
    <div class="game-body crossBridge">
      <section class="score">
        <span class="correct">{{gameResult.correct}}</span>/
        <span class="total">{{gameResult.total}}</span>
      </section>
      <section class="matching-pairs">
        <div class='matching-pair' v-for="(item, index) in droppableWords" :key="index">
          <span class='droppable' :data-word="item.name" :style="{'margin-top':dropPos[index]}"></span>
        </div>
      </section>
      <div v-for="(item, index) in draggableWords" :key="index"
        @touchstart="touchStart($event,item)"
        @touchmove="touchMove($event,item)"
        @touchend="touchEnd($event,item)"
        class="draggable" :style="{left: item.left, top: item.top}">{{item.name}}</div>
      <div class="draging-view" ref="dragView"></div>
      <img class="answer-emo" :src="gameResult.gameStatus === 3? require('./img/answer_over.png'):require('./img/answer_emo.png')"/>
      <img class="game-house" src="./img/house.png"/>
      <div :class="['game-word',gameResult.gameStatus === 3? 'game-word-entrance':'']">{{gameResult.correctWord}}</div>
      <button id="play-again-btn" ref="againBtn" @click="playAgainBtnClick">下一题</button>
    </div>
    <CountProgress class="count-progress-warp" :start="gameConfig.startPlay" :time="gameConfig.playTime"
      @onCountdown="onCountdown" @onTimeout="onCountdown(0)"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CountProgress from '../../components/CountdownProgress.vue'
import { Word, Config, Result, getElementPosition } from '@/utils/BaseGame.ts'

@Component({
  components: {
    CountProgress
  }
})
export default class App extends Vue {
  words: Array<Word> = []

  gameConfig: Config = {
    isHorizontal: false,
    startPlay: false,
    playTime: 15000,
    isFirst: true
  }

  gameResult: Result = {
    correct: 0,
    total: 0,
    gameStatus: 0,
    correctWord: ''
  }

  draggableWords: Array<Word> = []
  droppableWords: Array<Word> = []
  dropPos: string[] = []

  root: any

  mounted () {
    this.root = document.querySelector('.game-body')
    this.initiateGame()
    const orientation = window.matchMedia('(orientation: portrait)')
    orientation.addListener(this.orientationLister)
    this.orientationLister(orientation)
    this.gameConfig.startPlay = true
    this.gameResult.gameStatus = 1
  }

  orientationLister (mql: MediaQueryList | MediaQueryListEvent) {
    if (mql.matches) {
      console.log('此时竖屏')
      this.gameConfig.isHorizontal = false
    } else {
      console.log('此时横屏')
      this.gameConfig.isHorizontal = true
    }
  }

  initiateGame () {
    this.words = [
      { id: 1, name: 'I', left: '15%', top: 'auto', isCorrect: false },
      { id: 2, name: 'am', left: '30%', top: 'auto', isCorrect: false },
      { id: 3, name: 'a', left: '45%', top: 'auto', isCorrect: false },
      { id: 4, name: 'good', left: '60%', top: 'auto', isCorrect: false },
      { id: 5, name: 'boy', left: '75%', top: 'auto', isCorrect: false }
    ]
    this.calculatePos()
    this.droppableWords = this.words
    this.draggableWords = this.generateRandomItemsArray(this.droppableWords)
    this.gameResult.correct = 0
    this.gameResult.total = this.words.length
    this.gameResult.correctWord = this.words.map(item => item.name).join(' ') + '.'
  }

  calculatePos () {
    // 答案可能是3、4、5个
    let dragPos: string[] = []
    if (this.words.length === 3) {
      dragPos = ['25%', '40%', '55%']
      this.dropPos = ['1.6rem', '0', '1.6rem']
    } else if (this.words.length === 4) {
      dragPos = ['20%', '35%', '50%', '65%']
      this.dropPos = ['2.0rem', '0.2rem', '0.2rem', '2.0rem']
    } else if (this.words.length === 5) {
      dragPos = ['15%', '30%', '45%', '60%', '75%']
      this.dropPos = ['2.0rem', '0.8rem', '0', '0.8rem', '2.0rem']
    }
    this.words.forEach((item, index) => {
      item.left = dragPos[index]
    })
  }

  touchStart (event: TouchEvent, word: Word) {
    this.dragChangePos(event, word)
  }

  touchMove (event: TouchEvent, word: Word) {
    this.dragChangePos(event, word)
  }

  touchEnd (event: TouchEvent, word: Word) {
    this.dragChangePos(event, word)
    this.checkDropPos(event, word)
  }

  dragChangePos (event: TouchEvent, word: Word) {
    const curTarget = event.currentTarget as HTMLElement
    const touch = event.targetTouches[0] || event.changedTouches[0]
    if (!curTarget || !touch) return
    const width = document.documentElement.clientWidth
    const curX = this.gameConfig.isHorizontal ? touch.pageX : touch.pageY
    const curY = this.gameConfig.isHorizontal ? touch.pageY : (width - touch.pageX)
    word.left = `${curX - curTarget.offsetWidth / 2}px`
    word.top = `${curY - curTarget.offsetHeight / 2}px`
  }

  checkDropPos (event: TouchEvent, word: Word) {
    const curTarget = event.currentTarget as HTMLElement
    const touch = event.targetTouches[0] || event.changedTouches[0]
    if (!curTarget || !touch) return
    const width = document.documentElement.clientWidth
    const curX = this.gameConfig.isHorizontal ? touch.pageX : touch.pageY
    const curY = this.gameConfig.isHorizontal ? touch.pageY : (width - touch.pageX)
    const droppableElements = Array.from(document.querySelectorAll('.droppable') as NodeListOf<HTMLElement>)
    const dropElem = droppableElements.find(elem => {
      const objPos = getElementPosition(elem)
      return objPos &&
        curX > objPos.x && curY > objPos.y &&
        curX < (objPos.x + objPos.w) &&
        curY < (objPos.y + objPos.h) &&
        elem.getAttribute('data-word') === word.name
    })

    if (dropElem) {
      const dropPos = getElementPosition(dropElem)
      word.left = `${dropPos.x + dropPos.w / 2 - curTarget.offsetWidth / 2}px`
      word.top = `${dropPos.y}px`
      word.isCorrect = true
    } else {
      word.isCorrect = false
    }

    this.handleGameStatus()
  }

  handleGameStatus () {
    const correctWords = this.draggableWords.filter(word => word.isCorrect)
    this.gameResult.correct = correctWords.length
    if (correctWords.length === this.words.length) {
      // Game Over!!
      const againBtn = this.$refs.againBtn as HTMLElement
      againBtn.style.display = 'block'
      this.gameConfig.startPlay = false
      setTimeout(() => {
        againBtn.classList.add('play-again-btn-entrance')
      }, 200)
    }
  }

  generateRandomItemsArray (originalArray: Array<Word>): Array<Word> {
    const res = []
    const clonedArray = JSON.parse(JSON.stringify(originalArray))
    for (let i = 1; i <= originalArray.length; i++) {
      const randomIndex = Math.floor(Math.random() * clonedArray.length)
      res.push(clonedArray[randomIndex])
      clonedArray.splice(randomIndex, 1)
    }
    return res.map((item, index) => {
      item.left = originalArray[index].left
      return item
    })
  }

  playAgainBtnClick (event: Event) {
    const againBtn = this.$refs.againBtn as HTMLElement
    console.log('clickAgain')
    againBtn.classList.remove('play-again-btn-entrance')
    const matchingPairs = this.root.querySelector('.matching-pairs')
    const scoreSection = this.root.querySelector('.score')
    matchingPairs.style.opacity = 0
    scoreSection.style.opacity = 0
    setTimeout(() => {
      againBtn.style.display = 'none'
      this.initiateGame()
      matchingPairs.style.opacity = 1
      scoreSection.style.opacity = 1
      this.gameConfig.startPlay = true
      this.gameResult.gameStatus = 1
    }, 500)
    event.stopPropagation()
  }

  onCountdown (time: number) {
    const correctWords = this.draggableWords.filter(word => word.isCorrect)
    if (time === 0) {
      this.gameConfig.startPlay = false
    }
    if (time === 0 && correctWords.length !== this.words.length) {
      // 失败
      this.gameResult.gameStatus = 3
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  width:100%;
  height:100%;
  overflow: hidden;
}

body{
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

$vw_base: 375;
$vw_fontsize: 20;
html {
  font-size: 20px; //不支持vw单位时，回退到px单位
  font-size: ($vw_fontsize / $vw_base) * 100vw;
}

@media screen and (orientation: landscape) {
  html {
    font-size: 20px;
    font-size: ($vw_fontsize / $vw_base) * 100vh;
  }
}

.score {
  font-family: monospace;
  text-align: right;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.25rem;
  padding: 0.5rem;
  position: relative;
  transition: opacity 0.2s;
}

.game-word{
  position: absolute;
  z-index:999;
  top: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  font-size: 1rem;
  color: #333;
  background-color: #ffdf25;
  padding: 0.6rem 1.0rem;
  transition: transform 0.5s;
}

.game-word-entrance{
  display: block;
  transform: translate(-50%,2rem);
}

#play-again-btn.play-again-btn-entrance {
  opacity: 1;
  transform: translate(-50%,6rem);
}

#play-again-btn {
  position: absolute;
  z-index:999;
  top: -0.5rem;
  left: 50%;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #333;
  border: 5px double #fff;
  border-radius: 14px;
  padding: 8px 10px;
  cursor: pointer;
  display: none;
  opacity: 0;
  transform: translateX(-50%);
  transition: opacity 0.5s, transform 0.5s, background-color 0.2s;
  :hover {
    background-color: #333;
  }
}

.draggable {
  z-index: 999;
  position: absolute;
  bottom: 3rem;
  height: 2.2rem;
  min-width: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  transition: opacity 0.2s;
  background-image: url('./img/drag_bg.png');
  background-position: center;
  background-size:100% 100%;
  background-repeat:no-repeat;
}

.matching-pairs {
  height: 7rem;
  transition: opacity 0.5s;
  display: flex;
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
  width: 68%;
  overflow: hidden;
  position: relative;
  background-image: url('./img/matching_bg.png');
  background-position: center 0.8rem;
  background-size:100% 100%;
  background-repeat:no-repeat;
  .matching-pair {
    flex: 1 auto;
    display: flex;
    justify-content: center;
    .droppable {
      height: 2.5rem;
      max-width:6rem;
      width: 90%;
      font-size: 4rem;
      background-image: url('./img/cloud.png');
      background-position: center;
      background-size:100% 100%;
      background-repeat:no-repeat;
      transition: 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      user-select: none;
    }
  }
}

.answer-emo{
  width: 5rem;
  height: 5rem;
  position:absolute;
  top: 30%;
  left: 0.5rem;
}

.game-house{
  width: 5rem;
  height: 5rem;
  position:absolute;
  top: 30%;
  right: 0.5rem;
}

.draging-view{
  position: absolute;
  display: none;
  top: 0;
  left: 0;
}

.count-progress-warp{
  position: absolute;
  bottom: 1.0rem;
  left: 50%;
  transform: translateX(-50%)
}

.trans-ani{
  transition: left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),top 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
