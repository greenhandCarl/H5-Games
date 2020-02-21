<template>
  <div class='record-container'>
    <div class='bar-container'>
      <img class='microphone' src='../assets/imgs/microphone.png' />
      <img class='signal' src='../assets/imgs/signal.png' />
      <div class='bar' :style='{ width: `${ currentTimeMs / totalTimeMs * 100 }%` }'></div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Record extends Vue {
  @Prop({ default: 0 }) totalTimeMs!: number

  timer: number | null = null
  currentTimeMs = 0
  start = false

  mounted () {
    this.currentTimeMs = this.totalTimeMs
    this.countDown()
  }

  countDown () {
    this.timer = setTimeout(() => {
      if (this.timer) clearTimeout(this.timer)
      console.log(1)
      console.log('this.currentTimeMs', this.currentTimeMs)
      if (this.currentTimeMs >= 20) {
        this.currentTimeMs = this.currentTimeMs - 20
        this.countDown()
      } else {
        this.currentTimeMs = 0
      }
    }, 20)
  }
}
</script>

<style lang='scss' scoped>
.record-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 88vw;
  left: 0;
  height: 3vh;
  width: 100%;
  .bar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80vh;
    height: 100%;
    background-color: rgb(208, 213, 219);
    border-radius: 1.5vh;
    .bar {
      width: 100%;
      height: 100%;
      background-color: rgba(4, 4, 4, 0.8);
      border-radius: 1.5vh;
    }
    .microphone {
      position: absolute;
      left: 50%;
      bottom: -1vh;
      transform: translateX(-50%);
      width: 7vh;
      height: 8vh;
      z-index: 2;
    }
    .signal {
      position: absolute;
      left: 50%;
      width: 6vh;
      height: 6vh;
      bottom: 4.6vh;
      transform: translateX(-50%);
      z-index: 1;
    }
  }
}

/* 横屏 */
@media screen and (orientation: landscape) {
  .record-container {
    top: 88vh;
    height: 3vw;
    .bar-container {
      width: 80vw;
      border-radius: 1.5vw;
      .bar {
        border-radius: 1.5vw;
      }
      .microphone {
        width: 7vw;
        height: 8vw;
        bottom: -1vw;
      }
      .signal {
        width: 6vw;
        height: 6vw;
        bottom: 4.6vw;
      }
    }
  }
}
</style>
