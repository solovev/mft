import defaultData from '@/site.json'

import Vue from 'vue'
import Vuex from 'vuex'

import { randomValue, getResource, setResource } from '@/main'

Vue.use(Vuex)

const copy = object => JSON.parse(JSON.stringify(object))

const createAntenna = (id, refer, n) => ({
  id: id + '',
  name: 'Antenna_RAN',
  description: 'Антенна радиодоступа (прямоугольник на АМС). Сектор ' + n,
  type: 'Antenna_RAN',
  baseType: 'Antenna',
  resourceCharacteristic: [
    {
      name: 'mountHeight',
      valueType: 'meters',
      value: '0'
    },
    {
      name: 'tiltAngle',
      valueType: 'degree',
      value: '0'
    },
    {
      name: 'azimuth',
      valueType: 'degree',
      value: '0'
    }
  ],
  resourceRelationship: [
    {
      id: refer + '',
      relationshipType: 'refersTo'
    }
  ]
})

const createStation = ({ id, name, coverType, cabinetType }) => ({
  id: id + '',
  description: 'Базовая станция',
  type: 'BaseStation',
  name: name,
  resourceCharacteristic: [
    {
      name: 'coverType',
      value: coverType || 'INDOOR'
    },
    {
      name: 'cabinetType',
      value: cabinetType || []
    }
  ],
  resourceRelationship: []
})

const createAMC = ({ id, constructionType, groundingType, height }) => ({
  id: id + '',
  type: 'AMC',
  description: 'Антенно-мачтовое сооружение',
  resourceCharacteristic: [
    {
      name: 'constructionType',
      value: constructionType || 'REINFORCED_CONCRETE'
    },
    {
      name: 'groundingType',
      value: groundingType || 'BUILDING'
    },
    {
      name: 'height',
      value: height || '30'
    }
  ],
  resourceRelationship: []
})

const findLastId = objects => {
  objects = objects.sort((a, b) => +a.id - +b.id)
  return +((objects[objects.length - 1] || {}).id || 0)
}

const setupRelations = (newObject, resources) => {
  const relations = (newObject.resourceRelationship || []).map(
    relation => relation.id
  )
  resources.forEach(object => {
    if (relations.indexOf(object.id) < 0) return

    const objectRelations = object.resourceRelationship || []
    objectRelations.push({
      id: newObject.id,
      relationshipType: 'refersTo'
    })
    object.resourceRelationship = objectRelations
  })
}

export default new Vuex.Store({
  state: {
    sites: defaultData,

    selectedStationIndex: 0,
    selectedAntennaIndex: 0,
    selectedSite: 'A'
  },
  getters: {
    siteKeys: state => Object.keys(state.sites),
    getObjects: (state, getters) => (relations, type) =>
      getters.resources.filter(
        object =>
          relations.indexOf(object.id) >= 0 &&
          (type === undefined ||
            object.type.toLowerCase() === type.toLowerCase())
      ) || [],
    resources: state => state.sites[state.selectedSite] || [],
    site: (state, getters) => {
      return (
        Object.values(getters.resources).find(
          object => object.type.toLowerCase() === 'site'
        ) || {}
      )
    },
    stations: (state, getters) => {
      const { site } = getters
      const relations = (site.resourceRelationship || []).map(r => r.id)
      return getters.getObjects(relations, 'BaseStation')
    },
    station: (state, getters) => {
      return getters.stations[state.selectedStationIndex] || {}
    },
    amcs: (satet, getters) => {
      const { station } = getters
      const relations = (station.resourceRelationship || []).map(r => r.id)
      return getters.getObjects(relations, 'AMC')
    },
    amc: (state, getters) => {
      return getters.amcs[0] || {}
    },
    antennas: (state, getters) => {
      const { station } = getters
      const relations = (station.resourceRelationship || []).map(r => r.id)
      return getters.getObjects(relations, 'Antenna_RAN')
    },
    antenna: (state, getters) => {
      return getters.antennas[state.selectedAntennaIndex] || {}
    }
  },
  mutations: {
    clearData (state) {
      Vue.set(state, 'sites', {})
    },
    setSite (state, { name, data }) {
      Vue.set(state.sites, name, data)
    },
    setSelectedAntenna (state, index) {
      state.selectedAntennaIndex = index || 0
    },
    setStationIndex (state, index) {
      state.selectedStationIndex = index || 0
    },
    setSelectedSite (state, siteKey) {
      state.selectedSite = siteKey || 'A'
    }
  },
  actions: {
    setData (context, data) {
      context.commit('clearData')

      Object.keys(data).forEach(siteName => {
        context.commit('setSite', { name: siteName, data: data[siteName] })
      })
    },
    selectSite (context, siteKey) {
      context.commit('setSelectedSite', siteKey)
    },
    selectAntenna (context, index) {
      context.commit('setSelectedAntenna', index)
    },
    selectStation (context, index) {
      context.dispatch('selectAntenna', 0)
      context.commit('setStationIndex', index)
    },
    removeStation ({ state, getters, dispatch }) {
      const { station, getObjects } = getters
      if (!station) return

      const relations = (station.resourceRelationship || []).map(r => r.id)

      const related = getObjects(relations).filter(object => object.type !== 'Site').map(object => object.id)
      related.push(station.id)

      const { selectedSite } = state
      const sites = copy(state.sites)
      sites[selectedSite] = sites[selectedSite].filter(
        object => related.indexOf(object.id) < 0
      )
      dispatch('setData', sites).then(() => {
        const stations = getters.stations
        dispatch('selectStation', stations.length - 1)
      })
    },
    createStation ({ state, getters, dispatch }) {
      const { stations, site } = getters

      const cabinetType = ['3G']
      Math.random() >= 0.5 && cabinetType.push('2G')
      Math.random() >= 0.5 && cabinetType.push('LTE')
      Math.random() >= 0.5 && cabinetType.push('5G')

      const newAMCId = findLastId(getters.resources) + 1
      const newStationId = newAMCId + 1

      const newAMC = createAMC({
        id: newAMCId,
        constructionType: Math.random() >= 0.5 ? 'MAIN_CONCRETE' : 'REINFORCED_CONCRETE',
        groundingType: Math.random() >= 0.5 ? 'GROUND' : 'BUILDING'
      })
      newAMC.resourceRelationship = [
        {
          id: site.id + '',
          relationshipType: 'refersTo'
        },
        {
          id: newStationId + '',
          relationshipType: 'refersTo'
        }
      ]

      const newStation = createStation({
        id: newStationId,
        name: 'Station ' + (stations.length + 1),
        coverType: Math.random() >= 0.5 ? 'INDOOR' : 'OUTDOOR',
        cabinetType
      })
      newStation.resourceRelationship = [
        {
          id: site.id + '',
          relationshipType: 'refersTo'
        },
        {
          id: newAMCId + '',
          relationshipType: 'refersTo'
        }
      ]

      const { selectedSite } = state
      const sites = copy(state.sites)
      setupRelations(newStation, sites[selectedSite])
      sites[selectedSite].push(newStation)
      sites[selectedSite].push(newAMC)
      dispatch('setData', sites).then(() => {
        const stations = getters.stations
        dispatch('selectStation', stations.length - 1)
      })
    },
    removeAntenna ({ state, getters, dispatch }) {
      const { antenna, getObjects } = getters
      if (!antenna) return

      const relations = (antenna.resourceRelationship || []).map(r => r.id)

      getObjects(relations).forEach(object => {
        object.resourceRelationship = object.resourceRelationship.filter(
          r => r.id !== antenna.id
        )
      })

      const { selectedSite } = state
      const sites = copy(state.sites)
      sites[selectedSite] = sites[selectedSite].filter(
        object => object.id !== antenna.id
      )
      dispatch('setData', sites).then(() => {
        const antennas = getters.stations
        dispatch('selectAntenna', antennas.length - 1)
      })
    },
    createAntenna (context) {
      const siteKey = context.state.selectedSite
      const lastId = findLastId(context.getters.resources)

      const { station, getObjects } = context.getters
      if (!station) return

      const relations = (station.resourceRelationship || []).map(r => r.id)
      const currentAntennas = getObjects(relations, 'Antenna_RAN')

      const newAntenna = createAntenna(lastId + 1, station.id, currentAntennas.length + 1)
      const resources = newAntenna.resourceCharacteristic || {}
      resources.forEach(resource => {
        const { name } = resource
        switch (name) {
          case 'mountHeight': {
            const { amc } = context.getters
            const max = getResource(amc, 'height', 0)
            resource.value = randomValue(0, max)
            break
          }
          case 'tiltAngle': {
            resource.value = randomValue(0, 10)
            break
          }
          case 'azimuth': {
            resource.value = randomValue(-360, 360)
            break
          }
        }
      })

      const sites = copy(context.state.sites)
      setupRelations(newAntenna, sites[siteKey])
      sites[siteKey].push(newAntenna)
      context.dispatch('setData', sites).then(() => {
        const antennas = context.getters.antennas
        context.dispatch('selectAntenna', antennas.length - 1)
      })
    },
    update ({ state, getters, dispatch }, { object, name, value }) {
      let { selectedSite, sites } = state
      sites = copy(sites)
      object = copy(object)

      setResource(object, name, value)

      const index = sites[selectedSite].findIndex(o => o.id === object.id)
      if (index < 0) return

      sites[selectedSite][index] = object

      dispatch('setData', sites)
    }
  }
})
