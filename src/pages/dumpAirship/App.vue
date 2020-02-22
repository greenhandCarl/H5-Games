<template>
  <div id="app">
    <div class="game-body dumpAirship">
      <section class="score">
        <span class="correct">{{gameResult.correct}}</span>/
        <span class="total">{{gameResult.total}}</span>
        <button id="play-again-btn" ref="againBtn" @click="playAgainBtnClick">重新开始</button>
      </section>
      <section class="matching-pairs">
        <div class='matching-pair' v-for="(item, index) in words" :key="index" :data-pos="index" @click="clickWord($event, item)">
          <span>{{item.name}}</span>
        </div>
      </section>
      <img class="answer-girl" src="./img/answer_girl.png" ref="girlElem" :style="girlStyle"/>
      <img class="game-airship" src="./img/airship.png"/>
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

  girlStyle = {
    left: '0.5rem',
    top: '30%'
  }

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
      { id: 1, name: 'Are', isCorrect: false },
      { id: 2, name: 'you', isCorrect: false },
      { id: 3, name: 'a', isCorrect: false },
      { id: 4, name: 'good', isCorrect: false },
      { id: 5, name: 'boy', isCorrect: false },
      { id: 6, name: '?', isCorrect: false }
    ]
    this.gameResult.correct = 0
    this.gameResult.total = this.words.length
    this.gameResult.correctWord = this.words.map(item => item.name).join(' ') + '.'
  }

  clickWord (event: Event, word: Word) {
    console.log(event.currentTarget)
    const curTarget = event.currentTarget as HTMLElement
    if (!curTarget) return
    const targetPos = curTarget.getAttribute('data-pos') || '0'
    if (parseInt(targetPos) === this.gameResult.correct) {
      const girlElem = this.$refs.girlElem as HTMLElement
      const curPos = getElementPosition(curTarget)
      const girlPos = getElementPosition(girlElem)

      this.girlStyle = {
        left: `${curPos.x + curPos.w / 2 - girlPos.w / 2}px`,
        top: `${curPos.y - curPos.h / 2}px`
      }
      curTarget.classList.add('matching-correct')
      this.gameResult.correct++
      word.isCorrect = true
    }
    this.handleGameStatus()
  }

  handleGameStatus () {
    const correctWords = this.words.filter(word => word.isCorrect)
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

  playAgainBtnClick (event: Event) {
    const againBtn = event.currentTarget as HTMLElement
    const matchingPairs = this.root.querySelector('.matching-pairs')
    const scoreSection = this.root.querySelector('.score')
    const matchingElements = this.root.querySelectorAll('.matching-pair') as NodeListOf<HTMLElement>
    matchingPairs.style.opacity = 0
    scoreSection.style.opacity = 0
    againBtn.classList.remove('play-again-btn-entrance')
    setTimeout(() => {
      matchingElements.forEach((elem: HTMLElement) => {
        elem.classList.remove('matching-correct')
      })
      this.girlStyle = {
        left: '0.5rem',
        top: '30%'
      }
      againBtn.style.display = 'none'
      this.initiateGame()
      matchingPairs.style.opacity = 1
      scoreSection.style.opacity = 1
      this.gameConfig.startPlay = true
    }, 500)
    event.stopPropagation()
  }

  onCountdown (time: number) {
    const correctWords = this.words.filter(word => word.isCorrect)
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

#play-again-btn.play-again-btn-entrance {
  opacity: 1;
  transform: translate(-50%,6rem);
}

.matching-pairs {
  height: 4.5rem;
  transition: opacity 0.5s;
  display: flex;
  flex-direction: row;
  width: 68%;
  overflow: hidden;
  position: relative;
  background-position: center;
  background-size:100% 100%;
  background-repeat:no-repeat;
  padding-top: 1rem;
  margin: 2.5rem auto;
  .matching-pair {
    height: 2.0rem;
    max-width: 33.3%;
    min-width: 2rem;
    flex: 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border: 1px solid #999;

    span {
      font-size: 1.0rem;
    }
  }

  .matching-correct{
    background: #3dccff;
  }
}

.count-progress-warp{
  position: absolute;
  bottom: 1.0rem;
  left: 50%;
  transform: translateX(-50%)
}

.answer-girl{
  width: 4rem;
  height: 4rem;
  position:absolute;
  top: 30%;
  left: 0.5rem;
  transition: left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),top 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.game-airship{
  width: 6rem;
  height: 6rem;
  position:absolute;
  top: 35%;
  right: 0.5rem;
}

</style>
