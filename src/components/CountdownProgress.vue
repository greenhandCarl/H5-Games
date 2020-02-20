<template>
    <div class="progress-warp">
      <div class="bar-warp">
        <div class="bar-progress" :style="'width:' + currentTime/time * 100 + '%'"></div>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator'

@Component({})
export default class CountdownProgress extends Vue {
  @Prop() start!: boolean
  @Prop() time!: number // 毫秒为单位

  currentTime = this.time
  duration = 50

  @Watch('start')
  changeStatus (val: boolean, old: boolean) {
    console.log('changeStatus')
    console.log(old)
    if (val) {
      this.onStart()
      this.startProgress()
    }
  }

  @Emit('onStart')
  onStart () {
    console.log('start')
    this.currentTime = this.time
  }

  @Emit('onCountdown')
  onCountdown (time?: number) {
    return time
  }

  @Emit('onTimeout')
  onTimeout () {
    return this.currentTime
  }

  startProgress () {
    setTimeout(() => {
      this.currentTime = this.currentTime - this.duration
      this.onCountdown(Math.ceil(this.currentTime))
      if (this.currentTime <= 0) {
        this.onTimeout()
        return
      }
      this.startProgress()
    }, this.duration)
  }
}
</script>

<style lang="scss" scoped>
.progress-warp {
  margin: 0 auto;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bar-warp{
  width: 100%;
  height: 0.5rem;
  background: rgb(131, 128, 128);
  border-radius: 0.25rem;
  position: relative;
  overflow: hidden;

  .bar-progress{
    width: 100%;
    height: 100%;
    background: #3dcc81;
    border-radius: 0.25rem;
    transition: width 0.05s cubic-bezier(0.645, 0.045, 0.355, 1)
  }
}
</style>
