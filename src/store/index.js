import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    token: '',
    role: []
  },
  mutations: {
    setUsername (state, data) {
      this.state.username = data
    },
    setToken (state, data) {
      this.state.token = data
    },
    setRole (state, data) {
      this.state.role = data
    }
  },
  actions: {}
})
