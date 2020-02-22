<template>
  <div id="app">
    <div class="game-body listenChoose">
      <div class="result-word">{{gameResult.correctWord}}</div>
      <div class="choose-word-warp">
        <div class="word-warp" v-for="(item, index) in words" :key="index"
          :style="{left: item.left, top: item.top}"
          @click.stop="clickWord($event, item)"
        ><img :src="item.img"/></div>
      </div>
    </div>
    <CountProgress class="count-progress-warp" :start="gameConfig.startPlay" :time="gameConfig.playTime"
      @onCountdown="onCountdown" @onTimeout="onCountdown(0)"/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import CountProgress from '../../components/CountdownProgress.vue'
import { Word, Config, Result } from '@/utils/BaseGame.ts'

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

  mounted () {
    this.initiateGame()
    const orientation = window.matchMedia('(orientation: portrait)')
    orientation.addListener(this.orientationLister)
    this.orientationLister(orientation)
    this.gameConfig.startPlay = true
    this.gameResult.gameStatus = 1
    this.gameResult.correctWord = 'wash face'
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
      { id: 1, name: 'friend', left:'25%', isCorrect: false, img: require('./img/listen_01.png') },
      { id: 2, name: 'you', left:'45%', isCorrect: false, img: require('./img/listen_02.png') },
      { id: 3, name: 'my', left:'65%', isCorrect: false, img: require('./img/listen_03.png') }
    ]
  }

  clickWord (event: Event, word: Word) {
    const curTarget = event.currentTarget as HTMLElement
    if (!curTarget) return
    console.log(event)
    console.log(curTarget)
    curTarget.style.top = '78%'
    word.isCorrect = true
    this.handleGameStatus()
  }

  handleGameStatus () {
    const correctWords = this.words.filter(word => word.isCorrect)
    this.gameResult.correct = correctWords.length
    if (correctWords.length === this.words.length) {
      // Game Over!!
      this.gameConfig.startPlay = false
    }
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

<style lang='scss'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
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
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

@media screen and (orientation: landscape) {
  html {
    font-size: 20px;
    font-size: ($vw_fontsize / $vw_base) * 100vh;
  }
}

.result-word{
  position: absolute;
  z-index:999;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  color: #333;
  background-color: #ffdf25;
  padding: 0.6rem 1.0rem;
  transition: transform 0.5s;
}

.choose-word-warp{
  position: absolute;
  width:100%;
  top:50%;
  display:flex;
  flex-direction:row;
  align-items: center;
  justify-content: center;
  .word-warp{
    position: absolute;
    text-align: center;
    width:5rem;
    height:5rem;
    transition: left 0.6s cubic-bezier(0.645, 0.045, 0.355, 1),top 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
    img{
      width:100%;
      height:auto;
    }
  }
}

.count-progress-warp{
  position: absolute;
  bottom: 1.0rem;
  left: 50%;
  transform: translateX(-50%)
}
</style>
