import Vue from 'vue'
import Vuex from '@/vuex'
import a from './a.js'
import b from './b.js'

Vue.use(Vuex)
// debugger
function persists() {
  return function(store) {
    const data = JSON.parse(localStorage.getItem('VUEX:STATE'))
    if(data) {
      store.replaceState(data)
    }
    store.subscribe((mutation, state) => {
      debugger
      localStorage.setItem('VUEX:STATE', JSON.stringify(state))
    })
  }
}

const store = new Vuex.Store({
  plugins: [
    persists()
  ],
  state: { // data
    age: 10
  },
  getters: { // 计算属性
    myAge(state) {
      return state.age + 20
    }
  },
  mutations: { // methods 同步更改state
    changeAgeSync(state, payload) {
      state.age += payload
    }
  },
  actions: { // 异步操作后将结果提交给mutations
    changeAgeAync({commit}, payload) {
      setTimeout(() => {
        commit('changeAgeSync', payload)
      }, 1000)
    }
  },
  modules: {
    a,
    b
  }
})

export default store