import c from './c.js'

export default {
  namespaced: true,
  state: {
    age: 222
  },
  getters: {
    myAge(state) {
      return state.age + 20
    }
  },
  mutations: {
    changeAgeSynca(state, payload) {
      state.age += payload
    }
  },
  actions: {},
  // modules: {
  //   c
  // }
}