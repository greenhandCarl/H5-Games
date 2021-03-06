<template>
  <div id="app">
    <div class="sea-warp"></div>
    <div class="game-body grabJellyfish">
      <div class="word-warp" v-for="(item, index) in words" :key="index"
        :style="{left: item.left, top: item.top}"
        @click.stop="clickWord($event, item)"
      >{{item.name}}</div>
    </div>
    <CountProgress class="count-progress-warp" :start="gameConfig.startPlay" time="20000" @onCountdown="onCountdown" @onTimeout="onCountdown(0)"/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import CountProgress from '../../components/CountdownProgress.vue'
import { Word, Config, Result } from '@/utils/BaseGame.ts'
import { RandomPos } from '@/utils/util'

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
      { id: 1, name: 'friend', isCorrect: false },
      { id: 2, name: 'you', isCorrect: false },
      { id: 3, name: 'my', isCorrect: false },
      { id: 4, name: 'what', isCorrect: false },
      { id: 5, name: 'boy', isCorrect: false },
      { id: 6, name: 'good', isCorrect: false }
    ]
    let clientWidth = document.documentElement.clientWidth
    let clientHeight = document.documentElement.clientHeight
    if (clientWidth < clientHeight) {
      // 竖屏
      clientWidth = document.documentElement.clientHeight
      clientHeight = document.documentElement.clientWidth
    }
    const showHeight = clientHeight - clientHeight / 5
    const randomPos: RandomPos = new RandomPos()
    const randomRadius = clientWidth / 375 * 30
    this.words.forEach(word => {
      console.log(randomRadius)
      const circleCenter = randomPos.getRandomPos(
        randomRadius,
        clientWidth - randomRadius,
        randomRadius,
        showHeight - randomRadius,
        randomRadius
      )
      word.left = `${circleCenter.x}px`
      word.top = `${circleCenter.y}px`
    })
  }

  clickWord (event: Event, word: Word) {
    const curTarget = event.currentTarget as HTMLElement
    if (!curTarget) return
    console.log(event)
    console.log(curTarget)
    curTarget.style.left = '0.5rem'
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

.sea-warp {
  height: 100%;
  width: 100%;
  background-image: url('./img/sea_bg.jpg');
  background-position: center;
  background-size:100% 100%;
  background-repeat:no-repeat;
}

.word-warp{
  position: absolute;
  text-align: center;
  background-image: url('./img/jelly_fish.png');
  background-position: center;
  background-size:100% 100%;
  background-repeat:no-repeat;
  font-size: 0.8rem;
  width:3rem;
  height:3rem;
  line-height:1.5rem;
  cursor: pointer;
  transition: left 0.6s cubic-bezier(0.645, 0.045, 0.355, 1),top 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
  animation: arm-bounce 1.0s ease-in infinite;
}

.count-progress-warp{
  position: absolute;
  bottom: 1.0rem;
  left: 50%;
  transform: translateX(-50%)
}

@keyframes arm-bounce {
  0% {
    transform: translateY(0);
  }
  65% {
    transform: translateY(0.4rem);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
