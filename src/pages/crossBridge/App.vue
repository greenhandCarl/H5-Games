<template>
  <div id="app">
    <div class="game-body" @touchmove="touchMove" @touchend="touchEnd">
      <section class="score">
        <span class="correct">{{gameResult.correct}}</span>/
        <span class="total">{{gameResult.total}}</span>
        <button id="play-again-btn" ref="againBtn" @click="playAgainBtnClick">重新开始</button>
      </section>
      <section class="matching-pairs">
        <div class='matching-pair' v-for="(item, index) in droppableWords" :key="index">
          <span class='droppable' :data-word="item.name"></span>
        </div>
      </section>
      <section class="draggable-items">
        <i v-for="(item, index) in draggableWords" :key="index" @touchstart="dragStart"
        class="draggable" :style="{color: item.color}" :data-word="item.name">{{item.name}}</i>
      </section>
      <div class="draging-view" ref="dragView"></div>
      <img class="answer-emo" src="./img/answer_emo.png"/>
      <img class="game-house" src="./img/house.png"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

interface Word {
    name: string;
    color: string;
}

interface Config {
    totalDraggableItems: number;
    totalMatchingPairs: number;
}

interface Result {
    correct: number;
    total: number;
}

interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}

@Component
export default class App extends Vue {
  words: Array<Word> = [
    { name: 'i', color: '#ff0000' },
    { name: 'am', color: '#fd5c63' },
    { name: 'a', color: '#333333' },
    { name: 'boy', color: '#a4c639' },
    { name: 'good', color: '#000000' }
  ]

  gameConfig: Config = {
    totalDraggableItems: 4,
    totalMatchingPairs: 4
  }

  gameResult: Result = {
    correct: 0,
    total: 0
  }

  draggableWords: Array<Word> = []
  droppableWords: Array<Word> = []

  root: any
  draggableElements: any
  droppableElements: any

  isHorizontal = false

  mounted () {
    this.root = document.querySelector('.game-body')
    this.initiateGame()
    const orientation = window.matchMedia('(orientation: portrait)')
    orientation.addListener(this.orientationLister)
    this.orientationLister(orientation)
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
    this.gameResult.correct = 0
    this.gameResult.total = this.gameConfig.totalDraggableItems
    this.draggableWords = this.generateRandomItemsArray(
      this.gameConfig.totalDraggableItems, this.words)

    const randomDroppableWords =
      this.gameConfig.totalMatchingPairs < this.gameConfig.totalDraggableItems
        ? this.generateRandomItemsArray(this.gameConfig.totalMatchingPairs, this.draggableWords)
        : this.draggableWords
    this.droppableWords = [...randomDroppableWords]
      .sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )

    this.$nextTick(() => {
      this.draggableElements = document.querySelectorAll('.draggable')
      this.droppableElements = document.querySelectorAll('.droppable')
    })
  }

  dragStart (event: TouchEvent) {
    console.log('dragStart')
    const sourceNode = event.currentTarget as HTMLElement
    if (!sourceNode) return
    // 克隆节点
    const clonedNode = sourceNode.cloneNode(true)
    // 在父节点插入克隆的节点
    const dragView = this.$refs.dragView as HTMLElement
    dragView.innerHTML = ''
    dragView.appendChild(clonedNode)
    dragView.style.display = 'block'
    this.dragChangePos(event)
  }

  touchMove (event: TouchEvent) {
    this.dragChangePos(event)
  }

  touchEnd (event: TouchEvent) {
    this.dragChangePos(event)
    console.log('touchEnd')
    const touch = event.targetTouches[0] || event.changedTouches[0]
    if (!touch) return
    const width = document.documentElement.clientWidth
    const curPos: Position = {
      x: this.isHorizontal ? touch.pageX : touch.pageY,
      y: this.isHorizontal ? touch.pageY : (width - touch.pageX),
      w: 0,
      h: 0
    }
    console.log(curPos)
    this.checkDropPos(curPos)
  }

  playAgainBtnClick (event: Event) {
    const againBtn = this.$refs.againBtn as HTMLElement
    console.log('clickAgain')
    againBtn.classList.remove('play-again-btn-entrance')
    const draggableItems = this.root.querySelector('.draggable-items')
    const matchingPairs = this.root.querySelector('.matching-pairs')
    const scoreSection = this.root.querySelector('.score')
    draggableItems.style.opacity = 0
    matchingPairs.style.opacity = 0
    scoreSection.style.opacity = 0
    setTimeout(() => {
      againBtn.style.display = 'none'
      this.droppableElements.forEach((elem: HTMLElement) => {
        elem.innerHTML = ''
      })
      this.initiateGame()
      draggableItems.style.opacity = 1
      matchingPairs.style.opacity = 1
      scoreSection.style.opacity = 1
    }, 500)
    event.stopPropagation()
  }

  checkDropPos (curPos: Position) {
    const dragView = this.$refs.dragView as HTMLElement
    const dragTarget = dragView.getElementsByClassName('draggable')[0]
    if (!dragTarget) return
    let isDrop = false
    this.droppableElements.forEach((elem: HTMLElement) => {
      const objPos = this.getObjPos(elem)
      if (objPos && curPos.x > objPos.x && curPos.x < (objPos.x + objPos.w) &&
        curPos.y > objPos.y && curPos.y < (objPos.y + objPos.h)) {
        console.log('in')
        if (elem.getAttribute('data-word') === dragTarget.getAttribute('data-word')) {
          console.log('answer true')
          elem.appendChild(dragTarget)
          dragView.style.display = 'none'
          this.gameResult.correct++
          isDrop = true
          if (this.gameResult.correct === Math.min(this.gameConfig.totalMatchingPairs, this.gameConfig.totalDraggableItems)) {
            // Game Over!!
            const againBtn = this.$refs.againBtn as HTMLElement
            againBtn.style.display = 'block'
            setTimeout(() => {
              againBtn.classList.add('play-again-btn-entrance')
            }, 200)
          }
        }
      }
    })
    if (!isDrop) {
      const oldPos = this.getFromTragetPos()
      if (!oldPos) return
      dragView.classList.add('trans-ani')
      this.$nextTick(() => {
        dragView.style.left = oldPos.x + 'px'
        dragView.style.top = oldPos.y + 'px'
        setTimeout(() => {
          dragView.classList.remove('trans-ani')
          dragView.style.display = 'none'
        }, 400)
      })
    }
  }

  dragChangePos (event: TouchEvent) {
    const touch = event.targetTouches[0] || event.changedTouches[0]
    if (!touch) return
    const width = document.documentElement.clientWidth
    const pos: Position = {
      x: this.isHorizontal ? touch.pageX : touch.pageY,
      y: this.isHorizontal ? touch.pageY : (width - touch.pageX),
      w: 0,
      h: 0
    }
    const dragView = this.$refs.dragView as HTMLElement
    dragView.style.left = (pos.x - dragView.offsetWidth / 2) + 'px'
    dragView.style.top = (pos.y - dragView.offsetHeight / 2) + 'px'
  }

  getFromTragetPos (): Position {
    const dragView = this.$refs.dragView as HTMLElement
    const dragTarget = dragView.getElementsByClassName('draggable')[0]
    if (dragTarget) {
      for (let i = 0; i < this.draggableElements.length; i++) {
        if (this.draggableElements[i].getAttribute('data-word') === dragTarget.getAttribute('data-word')) {
          return this.getObjPos(this.draggableElements[i])
        }
      }
    }
    return { x: 0, y: 0, w: 0, h: 0 }
  }

  generateRandomItemsArray (n: number, originalArray: Array<Word>): Array<Word> {
    const res = []
    const clonedArray = [...originalArray]
    if (n > clonedArray.length) n = clonedArray.length
    for (let i = 1; i <= n; i++) {
      const randomIndex = Math.floor(Math.random() * clonedArray.length)
      res.push(clonedArray[randomIndex])
      clonedArray.splice(randomIndex, 1)
    }
    return res
  }

  getObjPos (target: HTMLElement): Position {
    const pos: Position = {
      x: target.offsetLeft,
      y: target.offsetTop,
      w: target.offsetWidth,
      h: target.offsetHeight
    }
    let offsetTarget = target.offsetParent as HTMLElement
    // 当元素为body时，其parent为null
    while (offsetTarget) {
      pos.x += offsetTarget.offsetLeft
      pos.y += offsetTarget.offsetTop
      offsetTarget = offsetTarget.offsetParent as HTMLElement
    }
    return pos
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

.draggable-items {
  display: flex;
  justify-content: center;
  margin: 1.5rem 1rem 0.5rem 1rem;
  transition: opacity 0.5s;
}

.draggable {
  height: 2.5rem;
  min-width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  transition: opacity 0.2s;
  background-image: url('./img/drag_bg.png');
  background-position: center;
  background-size:100% 100%;
  background-repeat:no-repeat;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
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
  background-position: center;
  background-size:100% 100%;
  background-repeat:no-repeat;
  padding-top: 0.8rem;
  .matching-pair {
    height: 2.5rem;
    max-width: 25%;
    flex: 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      user-select: none;
    }

    .droppable {
      width: 90%;
      font-size: 4rem;
      background-image: url('./img/cloud.png');
      background-position: center;
      background-size:100% 100%;
      background-repeat:no-repeat;
      transition: 0.2s;
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

.trans-ani{
  transition: left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),top 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
