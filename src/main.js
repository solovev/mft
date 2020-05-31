import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

const colors = ['rgb(17, 223, 113)', 'rgb(255, 185, 50)', 'rgb(186, 185, 255)']
export const randomValue = (min, max) => {
  min = min || 0
  max = max || 256

  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

export const getResource = Vue.prototype.$getResource = (object, resourceName, defaultValue) => {
  object = object || {}
  const resources = object.resourceCharacteristic || []
  for (const resource of resources) {
    const { name, value } = resource
    if (name !== resourceName) continue
    return value
  }
  return defaultValue
}

export const setResource = (object, resourceName, value) => {
  object = object || {}
  const resources = object.resourceCharacteristic || []
  for (const resource of resources) {
    const { name } = resource
    if (name !== resourceName) continue

    resource.value = value
    break
  }
}

Vue.prototype.$getColor = index => {
  let result = colors[index]
  if (!result) {
    result = colors[
      index
    ] = `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`
  }
  return result
}

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
