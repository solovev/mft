<template>
  <ul class="communication-list row row--center">
    <li
      v-for="item in list"
      :key="item"
      :class="{ 'active': isActive(item), 'dummy': dummy }"
      :style="(isActive(item) && item === 'LTE') && { 'background-color': selectedColor  }"
    >{{ item }}</li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CommunicationList',
  props: {
    activeStandards: Array,
    dummy: Boolean
  },
  created () {
    this.list = ['2G', '3G', 'LTE', '5G']
  },
  computed: {
    ...mapGetters(['station']),
    selectedColor () {
      return this.$getColor(this.$store.state.selectedAntennaIndex || 0)
    },
    cabinetType () {
      return this.$getResource(this.station, 'cabinetType', ['3G'])
    }
  },
  methods: {
    isActive (item) {
      return this.cabinetType.indexOf(item) >= 0
    }
  }
}
</script>

<style lang="scss" scoped>
.communication-list {
  flex-wrap: wrap;

  & > li {
    margin: 0.5px;
    padding: $base-offset * 2;
    color: #fff;
    background-color: $faded-color;

    &.active {
      background-color: $site-path-color;
    }

    &.dummy {
      background-color: $faded-color !important;
    }
  }
}
</style>
