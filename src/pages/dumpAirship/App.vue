<template>
  <div id="app">
    <div class="game-body">
      <section class="score">
        <span class="correct">{{gameResult.correct}}</span>/
        <span class="total">{{gameResult.total}}</span>
        <button id="play-again-btn" ref="againBtn" @click="playAgainBtnClick">重新开始</button>
      </section>
      <section class="matching-pairs">
        <div class='matching-pair' v-for="(item, index) in words" :key="index" :data-pos="index" @click="clickWord">
          <span>{{item.name}}</span>
        </div>
      </section>
      <CountProgress class="count-progress-warp" :start="startPlay" time="20000" @onCountdown="onCountdown" @onTimeout="onCountdown(0)"/>
      <img class="answer-girl" src="./img/answer_girl.png"/>
      <img class="game-airship" src="./img/airship.png"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CountProgress from '../../components/CountdownProgress.vue'

interface Word {
  name: string;
  isCorrect: boolean;
}

interface Config {
  totalMatchingPairs: number;
}

interface Result {
  correct: number;
  total: number;
}

interface Position {
  x: number;
  y: number;
  w?: number;
  h?: number;
}

@Component({
  components: {
    CountProgress
  }
})
export default class App extends Vue {
  words: Word[] = [
    {
      name: 'Are',
      isCorrect: false
    },
    {
      name: 'you',
      isCorrect: false
    },
    {
      name: 'a',
      isCorrect: false
    },
    {
      name: 'good',
      isCorrect: false
    },
    {
      name: 'boy',
      isCorrect: false
    },
    {
      name: '?',
      isCorrect: false
    }
  ]

  gameConfig: Config = {
    totalMatchingPairs: 6
  }

  gameResult: Result = {
    correct: 0,
    total: 0
  }

  currentPos = 0
  isHorizontal = false
  startPlay = false

  girlView: any

  mounted () {
    this.girlView = document.querySelector('.answer-girl')
    this.initiateGame()
    const orientation = window.matchMedia('(orientation: portrait)')
    orientation.addListener(this.orientationLister)
    this.orientationLister(orientation)
    this.startPlay = true
  }

  orientationLister (mql: any) {
    if (mql.matches) {
      console.log('此时竖屏')
      this.isHorizontal = false
    } else {
      console.log('此时横屏')
      this.isHorizontal = true
    }
  }

  initiateGame () {
    this.gameResult.total = this.gameConfig.totalMatchingPairs
  }

  clickWord (event: any) {
    console.log(event.currentTarget)
    if (!event.currentTarget) return
    const targetPos = event.currentTarget.getAttribute('data-pos')
    console.log(targetPos)
    if (parseInt(targetPos) === this.currentPos) {
      this.currentPos++
      this.gameResult.correct++
      event.currentTarget.classList.add('matching-correct')
      const objPos: any = this.getObjPos(event.currentTarget)
      const girlPos: any = this.getObjPos(this.girlView)
      this.girlView.style.left = (objPos.x + objPos.w / 2 - girlPos.w / 2) + 'px'
      this.girlView.style.top = (objPos.y - girlPos.h / 2) + 'px'
    }
    if (this.gameResult.correct === this.gameResult.total) {
      const againBtn: any = this.$refs.againBtn
      againBtn.style.display = 'block'
      setTimeout(() => {
        againBtn.classList.add('play-again-btn-entrance')
      }, 200)
    }
  }

  playAgainBtnClick (event: any) {
    const againBtn: any = this.$refs.againBtn
    console.log('clickAgain')
    againBtn.classList.remove('play-again-btn-entrance')
    this.gameResult.correct = 0
    this.gameResult.total = 0
    this.currentPos = 0
    const matchingPairs: any = document.querySelector('.matching-pairs')
    const scoreSection: any = document.querySelector('.score')
    const correctSpan: any = document.querySelector('.correct')
    const totalSpan: any = document.querySelector('.total')
    matchingPairs.style.opacity = 0
    scoreSection.style.opacity = 0
    setTimeout(() => {
      againBtn.style.display = 'none'
      const matchingElements: any = document.querySelectorAll('.matching-pair')
      matchingElements.forEach((elem: HTMLElement) => {
        elem.classList.remove('matching-correct')
      })
      this.girlView.style.left = '0.5rem'
      this.girlView.style.top = '30%'
      this.initiateGame()
      correctSpan.textContent = this.gameResult.correct
      totalSpan.textContent = this.gameResult.total
      matchingPairs.style.opacity = 1
      scoreSection.style.opacity = 1
    }, 500)
    event.stopPropagation()
    this.startPlay = true
  }

  getObjPos (target: HTMLElement): Position {
    const pos: Position = {
      x: target.offsetLeft,
      y: target.offsetTop,
      w: target.offsetWidth,
      h: target.offsetHeight
    }
    let offsetTarget: any = target.offsetParent
    // 当元素为body时，其parent为null
    while (offsetTarget) {
      pos.x += offsetTarget.offsetLeft
      pos.y += offsetTarget.offsetTop
      offsetTarget = offsetTarget.offsetParent
    }
    return pos
  }

  onCountdown (time: number) {
    if (time === 0) {
      this.startPlay = false
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
