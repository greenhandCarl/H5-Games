<template>
  <div id="app">
    <div class="sea-warp"></div>
    <div class="game-body">
      <div class="word-warp" v-for="(item, index) in words"
        :key="index"
        :style="{
          left: `${item.x}px`,
          top: `${item.y}px`,
          width: `${item.radius * 2}px`,
          height: `${item.radius * 2}px`,
          lineHeight: `${item.radius}px`
        }" @click="clickWord($event, item)"
      >{{item.content}}</div>
    </div>
    <CountProgress class="count-progress-warp" :start="gameConfig.startPlay" time="20000" @onCountdown="onCountdown" @onTimeout="onCountdown(0)"/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import CountProgress from '../../components/CountdownProgress.vue'
import { RandomPos } from '@/utils/util'

interface Word {
  content: string;
  id: string;
  selected: boolean;
}

interface Config {
  totalMatchingPairs: number;
  startPlay: boolean;
}
@Component({
  components: {
    CountProgress
  }
})
export default class App extends Vue {
  words: Array<Word> = [
    { content: 'friend', id: '0', selected: false },
    { content: 'you', id: '1', selected: false },
    { content: 'my', id: '2', selected: false },
    { content: 'what', id: '3', selected: false },
    { content: 'boy', id: '4', selected: false },
    { content: 'good', id: '5', selected: false }
  ]

  prevWord: Word = { content: '', id: '', selected: false }

  gameConfig: Config = {
    totalMatchingPairs: 6,
    startPlay: false
  }

  isHorizontal = false

  mounted () {
    const orientation = window.matchMedia('(orientation: portrait)')
    orientation.addListener(this.orientationLister)
    this.orientationLister(orientation)
    this.initiateGame()
    this.gameConfig.startPlay = true
  }

  orientationLister (mql: MediaQueryList | MediaQueryListEvent) {
    if (mql.matches) {
      console.log('此时竖屏')
      this.isHorizontal = false
    } else {
      console.log('此时横屏')
      this.isHorizontal = true
    }
  }

  initiateGame () {
    let clientWidth = document.documentElement.clientWidth
    let clientHeight = document.documentElement.clientHeight
    if (clientWidth < clientHeight) {
      // 竖屏
      clientWidth = document.documentElement.clientHeight
      clientHeight = document.documentElement.clientWidth
    }
    const showHeight = clientHeight - (clientWidth * 5) / 100
    const randomPos: RandomPos = new RandomPos()
    this.words = this.words.map(item => {
      const randomRadius = randomPos.getRandomNumberByRange(80, 80)
      const circleCenter = randomPos.getRandomPos(
        randomRadius,
        clientWidth - randomRadius,
        randomRadius,
        showHeight - randomRadius,
        randomRadius
      )
      const pos = {
        x: circleCenter.x - randomRadius,
        y: circleCenter.y - randomRadius,
        radius: randomRadius
      }
      return { ...item, ...pos }
    })
  }

  clickWord (event: Event, word: Word) {
    console.log(event)
    if (word.id === this.prevWord.id) {
      this.words = this.words.filter(item => item.id !== word.id)
    } else {
      const curTarget = event.currentTarget as HTMLElement
      this.words = this.words.map(item => {
        if (item.id === word.id) {
          curTarget.style.left = '0.5rem'
          curTarget.style.top = '78%'
          return { ...item, selected: true }
        }
        return { ...item, selected: false }
      })
    }
    this.prevWord = word
  }

  onCountdown (time: number) {
    if (time === 0) {
      this.gameConfig.startPlay = false
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

body{
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
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
  background-image: url('./img/jelly_flish.png');
  background-position: center;
  background-size:100% 100%;
  background-repeat:no-repeat;
  font-size: 0.8rem;
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
