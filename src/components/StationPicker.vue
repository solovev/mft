<template>
  <div class="picker">
    <ul class="row">
      <li
        v-for="(station, index) in (stations || [])"
        :key="station.id"
        :title="station.name"
        :class="{ 'selected': value === index }"
        @click="handleClick(index)"
      ></li>
      <li class="placeholder" v-if="!stations || stations.length === 0">

      </li>
    </ul>
    <div class="picker__description row" :data-counter="`${currentNumber}/${stations.length}`">
      <h3 class="ellipsis">{{ currentStation.name || '...' }}</h3>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'StationPicker',
  computed: {
    ...mapState({
      value: 'selectedStationIndex'
    }),
    ...mapGetters(['stations']),
    currentStation () {
      return this.stations[this.value] || {}
    },
    currentNumber () {
      return (!this.stations || this.stations.length === 0) ? 0 : this.value + 1
    }
  },
  methods: {
    handleClick (index) {
      this.$store.dispatch('selectStation', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.picker {
  & > ul {
    flex-wrap: wrap;
  }

  li {
    $size: 12px;
    width: $size;
    height: $size;
    border-radius: 50%;
    background-color: rgb(0, 198, 92);
    margin: $base-offset / 2;
    cursor: pointer;

    &:not(.selected) {
      opacity: 0.5;
    }

    &:hover {
      opacity: 1;
    }

    &.placeholder {
      background-color: $faded-color;
    }
  }

  &__description {
    margin-left: $base-offset / 2;
    margin-top: $base-offset;
    line-height: 19px;

    &::after {
      content: attr(data-counter);
    }

    & > h3 {
      margin: 0;
      flex: 1;
    }
  }
}
</style>
