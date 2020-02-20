import Vue from 'vue'
import App from './App.vue'
import { detectOrient } from '../../utils/util'

window.onresize = detectOrient
detectOrient()

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#dumpAirship')
