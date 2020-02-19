<template>
  <div id="app">
    <div class="drag-body" @touchmove="touchMove" @touchend="touchEnd">
      <section class="score">
        <span class="correct">{{gameResult.correct}}</span>/
        <span class="total">{{gameResult.total}}</span>
        <button id="play-again-btn" ref="againBtn" @click="playAgainBtnClick">重新开始</button>
      </section>
      <section class="draggable-items">
        <span v-for="(item, index) in draggableWords" :key="index" @touchstart.stop="dragStart"
        class="draggable" :style="{color: item.color}" :data-word="item.name">
          <img src="./img/drag_bg.png"/>
          <i class="drag-word">{{item.name}}</i>
        </span>
      </section>
      <section class="matching-pairs">
        <div class='matching-pair' v-for="(item, index) in droppableWords" :key="index">
          <span class='droppable' :data-word="item.name"></span>
        </div>
      </section>
      <div class="draging-view" ref="dragView"></div>
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
  w?: number;
  h?: number;
}

@Component
export default class App extends Vue {
  words: Word[] = [
    {
      name: 'i',
      color: '#ff0000'
    },
    {
      name: 'am',
      color: '#fd5c63'
    },
    {
      name: 'a',
      color: '#333333'
    },
    {
      name: 'boy',
      color: '#a4c639'
    },
    {
      name: 'good',
      color: '#000000'
    }
  ]

  gameConfig: Config = {
    totalDraggableItems: 3,
    totalMatchingPairs: 3
  }

  gameResult: Result = {
    correct: 0,
    total: 0
  }

  draggableWords: Word[] = []
  droppableWords: Word[] = []

  dragView: any
  draggableElements: any
  droppableElements: any

  isHorizontal = false

  mounted () {
    this.dragView = this.$refs.dragView
    this.initiateGame()
    const orientation = window.matchMedia('(orientation: portrait)')
    orientation.addListener(this.orientationLister)
    this.orientationLister(orientation)
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

  dragStart (event: any) {
    console.log('dragStart')
    console.log(event.currentTarget)
    if (!event.currentTarget) return
    const sourceNode = event.currentTarget
    const objPos: any = this.getObjPos(sourceNode)
    console.log(event)
    // 克隆节点
    const clonedNode = sourceNode.cloneNode(true)
    sourceNode.style.visibility = 'hidden'
    console.log(clonedNode)
    // 在父节点插入克隆的节点
    this.dragView.innerHTML = ''
    clonedNode.style.width = objPos.w + 'px'
    clonedNode.style.height = objPos.h + 'px'
    this.dragView.appendChild(clonedNode)
    this.dragView.style.display = 'block'
    this.dragChangePos(event)
  }

  touchMove (event: any) {
    this.dragChangePos(event)
  }

  touchEnd (event: any) {
    this.dragChangePos(event)
    console.log('touchEnd')
    const touch = event.targetTouches[0] || event.changedTouches[0]
    console.log(touch)
    if (!touch) return
    const width = document.documentElement.clientWidth
    const curPos: Position = {
      x: this.isHorizontal ? touch.pageX : touch.pageY,
      y: this.isHorizontal ? touch.pageY : (width - touch.pageX)
    }
    console.log(curPos)
    this.checkDropPos(curPos)
  }

  playAgainBtnClick (event: any) {
    const againBtn: any = this.$refs.againBtn
    console.log('clickAgain')
    againBtn.classList.remove('play-again-btn-entrance')
    this.gameResult.correct = 0
    this.gameResult.total = 0
    const draggableItems: any = document.querySelector('.draggable-items')
    const matchingPairs: any = document.querySelector('.matching-pairs')
    const scoreSection: any = document.querySelector('.score')
    const correctSpan: any = document.querySelector('.correct')
    const totalSpan: any = document.querySelector('.total')
    draggableItems.style.opacity = 0
    matchingPairs.style.opacity = 0
    scoreSection.style.opacity = 0
    setTimeout(() => {
      againBtn.style.display = 'none'
      this.droppableElements.forEach((elem: HTMLElement) => {
        elem.innerHTML = ''
      })
      this.initiateGame()
      correctSpan.textContent = this.gameResult.correct
      totalSpan.textContent = this.gameResult.total
      draggableItems.style.opacity = 1
      matchingPairs.style.opacity = 1
      scoreSection.style.opacity = 1
    }, 500)
    event.stopPropagation()
  }

  checkDropPos (curPos: Position) {
    console.log(this.dragView)
    const dragTarget = this.dragView.getElementsByClassName('draggable')[0]
    if (!dragTarget) return
    let isDrop = false
    this.droppableElements.forEach((elem: HTMLElement) => {
      const objPos: any = this.getObjPos(elem)
      if (objPos && curPos.x > objPos.x && curPos.x < (objPos.x + objPos.w) &&
        curPos.y > objPos.y && curPos.y < (objPos.y + objPos.h)) {
        console.log('in')
        if (elem.getAttribute('data-word') === dragTarget.getAttribute('data-word')) {
          console.log('answer true')
          elem.appendChild(dragTarget)
          this.dragView.style.display = 'none'
          this.gameResult.correct++
          isDrop = true
          if (this.gameResult.correct === Math.min(this.gameConfig.totalMatchingPairs, this.gameConfig.totalDraggableItems)) {
            // Game Over!!
            const againBtn: any = this.$refs.againBtn
            againBtn.style.display = 'block'
            setTimeout(() => {
              againBtn.classList.add('play-again-btn-entrance')
            }, 200)
          }
        }
      }
    })
    if (!isDrop) {
      const oldTraget: any = this.getFromTragetPos()
      if (!oldTraget) return
      this.dragView.classList.add('trans-ani')
      this.$nextTick(() => {
        console.log('oldPos')
        console.log(oldTraget)
        const oldPos = this.getObjPos(oldTraget)
        this.dragView.style.left = oldPos.x + 'px'
        this.dragView.style.top = oldPos.y + 'px'
        setTimeout(() => {
          this.dragView.classList.remove('trans-ani')
          this.dragView.style.display = 'none'
          oldTraget.style.visibility = 'visible'
        }, 400)
      })
    }
  }

  dragChangePos (event: any) {
    const touch = event.targetTouches[0] || event.changedTouches[0]
    if (!touch) return
    const width = document.documentElement.clientWidth
    const pos: Position = {
      x: this.isHorizontal ? touch.pageX : touch.pageY,
      y: this.isHorizontal ? touch.pageY : (width - touch.pageX)
    }
    this.dragView.style.left = (pos.x - this.dragView.offsetWidth / 2) + 'px'
    this.dragView.style.top = (pos.y - this.dragView.offsetHeight / 2) + 'px'
  }

  getFromTragetPos (): any {
    const dragTarget: HTMLElement = this.dragView.getElementsByClassName('draggable')[0]
    if (!dragTarget) return ''
    for (let i = 0; i < this.draggableElements.length; i++) {
      if (this.draggableElements[i].getAttribute('data-word') === dragTarget.getAttribute('data-word')) {
        return this.draggableElements[i]
      }
    }
    return ''
  }

  generateRandomItemsArray (n: number, originalArray: Word[]): Word[] {
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
    let offsetTarget: any = target.offsetParent
    // 当元素为body时，其parent为null
    while (offsetTarget) {
      pos.x += offsetTarget.offsetLeft
      pos.y += offsetTarget.offsetTop
      offsetTarget = offsetTarget.offsetParent
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
  .play-again-btn-entrance {
    opacity: 1;
    transform: translate(-50%,6rem);
  }
}

.draggable-items {
  display: flex;
  width: 80%;
  height: 5rem;
  justify-content: center;
  margin: 1.5rem 1.5rem 0.5rem 1.5rem;
  transition: opacity 0.5s;

  >span{
    margin-left: 1.4rem;
    margin-right: 1.4rem;
  }
}

.draggable {
  height: 2.5rem;
  min-width: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: bold;
  transition: opacity 0.2s;
  background-position: center;
  background-size:100% 100%;
  background-repeat:no-repeat;
  img{
    width: 100%;
  }

  .drag-word{
    height: 2rem;
    width: 100%;
    display: block;
  }
}

.matching-pairs {
  height: 4.5rem;
  transition: opacity 0.5s;
  display: flex;
  flex-direction: row;
  width: 80%;
  overflow: hidden;
  position: relative;
  background-position: center;
  background-size:100% 100%;
  background-repeat:no-repeat;
  padding-top: 1rem;
  margin: 1.5rem 1.5rem 0.5rem 1.5rem;
  .matching-pair {
    height: 2.5rem;
    max-width: 33.3%;
    min-width: 2rem;
    flex: 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 1.4rem;
    margin-right: 1.4rem;

    .droppable {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      user-select: none;
      width: 90%;
      font-size: 4rem;
      background-position: center;
      background-size:100% 100%;
      background-repeat:no-repeat;
      transition: 0.2s;
      border-bottom: 2px solid #3514f3;
    }
  }
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
