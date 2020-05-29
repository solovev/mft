import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sites: {}
  },
  getters: {
    names: state => Object.keys(state.sites)
  },
  mutations: {
    clearData (state) {
      Vue.set(state, 'sites', {})
    },
    setSite (state, { name, data }) {
      Vue.set(state.sites, name, data)
    }
  },
  actions: {
    setData (context, data) {
      context.commit('clearData')

      Object.keys(data).forEach(siteName => {
        context.commit('setSite', { name: siteName, data: data[siteName] })
      })
    }
  }
})
