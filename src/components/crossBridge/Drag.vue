<template>
  <div class="drag-body">
    <section class="score">
      <span class="correct">{{gameResult.correct}}</span>/
      <span class="total">{{gameResult.total}}</span>
      <button id="play-again-btn">重新开始</button>
    </section>
    <section class="matching-pairs"></section>
    <section class="draggable-items"></section>
    <div class="draging-view"></div>
  </div>
</template>

<script>
let scoreSection = ''
let correctSpan = ''
let totalSpan = ''
let playAgainBtn = ''

let draggableItems = ''
let matchingPairs = ''
let draggableElements
let droppableElements
let dragingView
let dragBody

export default {
  name: 'Drag',
  props: {
    msg: String
  },

  data () {
    return {
      brands: [
        {
          brandName: 'i',
          color: '#ff0000'
        },
        {
          brandName: 'am',
          color: '#fd5c63'
        },
        {
          brandName: 'a',
          color: '#333333'
        },
        {
          brandName: 'boy',
          color: '#a4c639'
        },
        {
          brandName: 'handsome',
          color: '#000000'
        }
      ],
      gameConfig: {
        totalDraggableItems: 4,
        totalMatchingPairs: 4
      },
      gameResult: {
        correct: 0,
        total: 0
      },
      currentPage: '0',
      currentType: 0 // 0按时间排序；1按人数排序
    }
  },

  mounted () {
    scoreSection = document.querySelector('.score')
    correctSpan = scoreSection.querySelector('.correct')
    totalSpan = scoreSection.querySelector('.total')
    playAgainBtn = scoreSection.querySelector('#play-again-btn')
    dragingView = document.querySelector('.draging-view')
    dragBody = document.querySelector('.drag-body')
    draggableItems = document.querySelector('.draggable-items')
    matchingPairs = document.querySelector('.matching-pairs')
    this.initiateGame()
    playAgainBtn.addEventListener('click', this.playAgainBtnClick)
    // dragBody.addEventListener('touchstart', this.touchStart)
    dragBody.addEventListener('touchmove', this.touchMove)
    dragBody.addEventListener('touchend', this.touchEnd)
  },

  methods: {
    initiateGame () {
      this.gameResult.total = this.gameConfig.totalDraggableItems
      const randomDraggableBrands = this.generateRandomItemsArray(
        this.gameConfig.totalDraggableItems, this.brands)

      const randomDroppableBrands =
        this.gameConfig.totalMatchingPairs < this.gameConfig.totalDraggableItems
          ? this.generateRandomItemsArray(this.gameConfig.totalMatchingPairs, randomDraggableBrands)
          : randomDraggableBrands
      const alphabeticallySortedRandomDroppableBrands = [...randomDroppableBrands]
        .sort((a, b) =>
          a.brandName.toLowerCase().localeCompare(b.brandName.toLowerCase())
        )

      // Create 'draggable-items' and append to DOM
      for (let i = 0; i < randomDraggableBrands.length; i++) {
        draggableItems.insertAdjacentHTML(
          'beforeend',
          `<i class='draggable' style='color: ${randomDraggableBrands[i].color};' data-brand='${randomDraggableBrands[i].brandName}'>${randomDraggableBrands[i].brandName}</i>`
        )
      }

      // Create 'matching-pairs' and append to DOM
      for (
        let i = 0;
        i < alphabeticallySortedRandomDroppableBrands.length;
        i++
      ) {
        matchingPairs.insertAdjacentHTML(
          'beforeend',
          `<div class='matching-pair'>
            <span class='droppable' data-brand='${alphabeticallySortedRandomDroppableBrands[i].brandName}'></span>
          </div>`
        )
      }

      draggableElements = document.querySelectorAll('.draggable')
      droppableElements = document.querySelectorAll('.droppable')

      draggableElements.forEach(elem => {
        elem.addEventListener('touchstart', this.dragStart)
      })
    },

    dragStart (event) {
      const sourceNode = event.target
      // 克隆节点
      const clonedNode = sourceNode.cloneNode(true)
      // 在父节点插入克隆的节点
      dragingView.innerHTML = ''
      dragingView.appendChild(clonedNode)
      dragingView.style.display = 'block'
      this.dragChangePos(event)
    },

    touchStart (event) {
      this.dragChangePos(event)
    },

    touchMove (event) {
      this.dragChangePos(event)
    },

    touchEnd (event) {
      this.dragChangePos(event)
      console.log('touchEnd')
      const touch = event.changedTouches[0]
      console.log(event)
      if (!touch) return
      const curPos = {
        x: touch.pageX,
        y: touch.pageY
      }
      console.log(curPos)
      this.checkDropPos(curPos)
    },

    checkDropPos (curPos) {
      console.log(dragingView)
      const dragTarget = dragingView.getElementsByClassName('draggable')[0]
      if (!dragTarget) return
      let isDrop = false
      droppableElements.forEach(elem => {
        const objPos = this.getObjPos(elem)
        if (curPos.x > objPos.x && curPos.x < (objPos.x + objPos.w) &&
          curPos.y > objPos.y && curPos.y < (objPos.y + objPos.h)) {
          console.log('in')
          if (elem.getAttribute('data-brand') === dragTarget.getAttribute('data-brand')) {
            console.log('answer true')
            elem.appendChild(dragTarget)
            dragingView.style.display = 'none'
            this.gameResult.correct++
            isDrop = true
            if (this.gameResult.correct === Math.min(this.gameConfig.totalMatchingPairs, this.gameConfig.totalDraggableItems)) {
              // Game Over!!
              playAgainBtn.style.display = 'block'
              setTimeout(() => {
                playAgainBtn.classList.add('play-again-btn-entrance')
              }, 200)
            }
          }
        }
      })
      if (!isDrop) {
        const oldPos = this.getFromTragetPos()
        if (!oldPos) return
        dragingView.classList.add('trans-ani')
        this.$nextTick(() => {
          console.log('oldPos')
          console.log(oldPos)
          dragingView.style.left = oldPos.x + 'px'
          dragingView.style.top = oldPos.y + 'px'
          setTimeout(() => {
            dragingView.classList.remove('trans-ani')
            dragingView.style.display = 'none'
          }, 400)
        })
      }
    },

    getFromTragetPos () {
      const dragTarget = dragingView.getElementsByClassName('draggable')[0]
      if (!dragTarget) return ''
      for (let i = 0; i < draggableElements.length; i++) {
        if (draggableElements[i].getAttribute('data-brand') === dragTarget.getAttribute('data-brand')) {
          return this.getObjPos(draggableElements[i])
        }
      }
      return ''
    },

    dragChangePos (event) {
      const touch = event.targetTouches[0] || event.changedTouches[0]
      if (!touch) return
      const curPos = {
        x: touch.pageX,
        y: touch.pageY
      }
      dragingView.style.left = (curPos.x - dragingView.offsetWidth / 2) + 'px'
      dragingView.style.top = (curPos.y - dragingView.offsetHeight / 2) + 'px'
    },

    playAgainBtnClick (event) {
      console.log('clickAgain')
      playAgainBtn.classList.remove('play-again-btn-entrance')
      this.gameResult.correct = 0
      this.gameResult.total = 0
      draggableItems.style.opacity = 0
      matchingPairs.style.opacity = 0
      setTimeout(() => {
        scoreSection.style.opacity = 0
      }, 100)
      setTimeout(() => {
        playAgainBtn.style.display = 'none'
        while (draggableItems.firstChild) {
          draggableItems.removeChild(draggableItems.firstChild)
        }
        while (matchingPairs.firstChild) {
          matchingPairs.removeChild(matchingPairs.firstChild)
        }
        this.initiateGame()
        correctSpan.textContent = this.gameResult.correct
        totalSpan.textContent = this.gameResult.total
        draggableItems.style.opacity = 1
        matchingPairs.style.opacity = 1
        scoreSection.style.opacity = 1
      }, 500)
      event.stopPropagation()
    },

    generateRandomItemsArray (n, originalArray) {
      const res = []
      const clonedArray = [...originalArray]
      if (n > clonedArray.length) n = clonedArray.length
      for (let i = 1; i <= n; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        res.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
      }
      return res
    },

    getObjPos (target) {
      const pos = {
        x: target.offsetLeft,
        y: target.offsetTop,
        w: target.offsetWidth,
        h: target.offsetHeight
      }
      let offsetTarget = target.offsetParent
      // 当元素为body时，其parent为null
      while (offsetTarget) {
        pos.x += offsetTarget.offsetLeft
        pos.y += offsetTarget.offsetTop
        offsetTarget = offsetTarget.offsetParent
      }
      return pos
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>
.score {
  font-family: monospace;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 0.25rem;
  padding: 1rem;
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
}

#play-again-btn:hover {
  background-color: #333;
}

#play-again-btn.play-again-btn-entrance {
  opacity: 1;
  transform: translate(-50%,6rem);
}

.draggable-items {
  display: flex;
  justify-content: center;
  margin: 3rem 1rem 0.5rem 1rem;
  transition: opacity 0.5s;
}

.draggable {
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: bold;
  padding: 0.5rem;
  transition: opacity 0.2s;
}

.draggable:hover {
  opacity: 0.5;
}

.matching-pairs {
  height: 8rem;
  transition: opacity 0.5s;
  display: flex;
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  overflow: hidden;
  position: relative;
  background-image: url('../../assets/crossBridge/matching_bg.png');
  background-position: center center;
  background-size:100% 100%;
  background-repeat:no-repeat;
}

.matching-pair {
  height: 3rem;
  flex: 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.matching-pair span {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  user-select: none;
}

.droppable {
  width: 6rem;
  font-size: 4rem;
  background-color: #fff;
  border: 3px dashed #111;
  transition: 0.2s;
}

.droppable-hover {
  background-color: #bee3f0;
  transform: scale(1.1);
}

.dropped {
  border-style: solid;
}

.dragged {
  user-select: none;
  opacity: 0.1;
  cursor: default;
}

.draggable.dragged:hover {
  opacity: 0.1;
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
