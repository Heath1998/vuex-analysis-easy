import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

var app = new Vue({
  store,
  test: 123,
  render: h => h(App),
}).$mount('#app')

console.log(app);