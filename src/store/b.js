export default {
  namespaced: true,
  state: {
    age: 333
  },
  getters: {
    myAgeb(state) {
      console.log(this);
      return state.age+100;
    }
  },
  mutations: {
    changeAgeSyncb(state, payload) {
      state.age += payload
    }
  },
  actions: {
    changeAgeAync({commit}, payload) {
      setTimeout(() => {
        console.log(commit)
        commit('changeAgeSyncb', payload)
      }, 1000)
    }
  }
}