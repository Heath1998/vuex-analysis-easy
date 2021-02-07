export default {
  namespaced: true,
  state: {
    age: 444
  },
  getters: {},
  mutations: {
    changeAgeSyncc(state, payload) {
      state.age += payload
    }
  },
  actions: {}
}