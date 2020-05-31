<template>
  <div class="settings row">
    <div class="settings__group" :data-caption="`Station (#${selectedStationIndex + 1})`">
      <div class="option row" data-caption="coverType:">
        <div
          class="button"
          :class="{ 'selected': stationCoverType === 'outdoor' }"
          @click="handleStationChanged('coverType', 'OUTDOOR'.toLowerCase())"
        >OUTDOOR</div>
        <div
          class="button"
          :class="{ 'selected': stationCoverType === 'indoor' }"
          @click="handleStationChanged('coverType', 'INDOOR'.toLowerCase())"
        >INDOOR</div>
      </div>
      <div class="option row" data-caption="cabinetType:">
        <div
          v-for="item in ['2G', '3G', 'LTE', '5G']"
          :key="item"
          class="button"
          :class="{ 'selected': stationCabinetType.indexOf(item) >= 0 }"
          @click="toggleCabinet(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="settings__group" :data-caption="`AMC (ID: ${amc.id})`">
      <div class="option row" data-caption="height:">
        <slider
          :min="amcHeightMin"
          :max="amcHeightMax"
          :value="amcHeight"
          @input="(value) => handleAMCChanged('height', value)"
        />
      </div>
      <div class="option row" data-caption="constructionType:">
        <div
          class="button"
          :class="{ 'selected': amcConstructionType === 'reinforced_concrete' }"
          @click="handleAMCChanged('constructionType', 'reinforced_concrete'.toLowerCase())"
        >REINFORCED</div>
        <div
          class="button"
          :class="{ 'selected': amcConstructionType === 'main_concrete' }"
          @click="handleAMCChanged('constructionType', 'main_concrete'.toLowerCase())"
        >MAIN</div>
      </div>
      <div class="option row" data-caption="groundingType:">
        <div
          class="button"
          :class="{ 'selected': amcGroundingType === 'building' }"
          @click="handleAMCChanged('groundingType', 'building'.toLowerCase())"
        >BUILDING</div>
        <div
          class="button"
          :class="{ 'selected': amcGroundingType === 'ground' }"
          @click="handleAMCChanged('groundingType', 'ground'.toLowerCase())"
        >GROUND</div>
      </div>
    </div>
    <div class="settings__group" :data-caption="`Antenna (ID: ${antenna.id || '?'})`">
      <div :style="{ 'background-color': $getColor(selectedAntennaIndex) }" class="mark" />
      <div class="option row" data-caption="mountHeight:">
        <slider
          :min="antennaHeightMin"
          :max="antennaHeightMax"
          :value="antennaHeight"
          @input="(value) => handleAntennaChanged('mountHeight', value)"
        />
      </div>
      <div class="option row" data-caption="tiltAngle:">
        <slider
          :min="minAngle"
          :max="maxAngle"
          :value="antennaTiltAngle"
          @input="(value) => handleAntennaChanged('tiltAngle', value)"
        />
      </div>
      <div class="option row" data-caption="azimuth:">
        <slider
          :min="minAngle"
          :max="maxAngle"
          :value="antennaAzimuth"
          @input="(value) => handleAntennaChanged('azimuth', value)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Slider from '@/components/Slider'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Settings',
  components: { Slider },
  created () {
    this.minAngle = -360
    this.maxAngle = 360
  },
  computed: {
    ...mapState(['selectedAntennaIndex', 'selectedStationIndex']),
    ...mapGetters(['amc', 'antenna', 'station']),
    stationCoverType () {
      return this.$getResource(
        this.station,
        'coverType',
        'OUTDOOR'
      ).toLowerCase()
    },
    stationCabinetType () {
      return this.$getResource(
        this.station,
        'cabinetType',
        ['3G']
      )
    },
    amcHeight () {
      return +this.$getResource(this.amc, 'height', '0')
    },
    amcConstructionType () {
      return this.$getResource(
        this.amc,
        'constructionType',
        'REINFORCED_CONCRETE'
      ).toLowerCase()
    },
    amcGroundingType () {
      return this.$getResource(
        this.amc,
        'groundingType',
        'BUILDING'
      ).toLowerCase()
    },
    amcHeightMax () {
      return Math.max(100, this.amcHeight)
    },
    amcHeightMin () {
      return Math.min(1, this.amcHeight)
    },
    antennaHeight () {
      return Math.min(
        this.antennaHeightMax,
        +this.$getResource(this.antenna, 'mountHeight', '0')
      )
    },
    antennaHeightMax () {
      return this.amcHeight
    },
    antennaHeightMin () {
      return Math.min(1, this.antennaHeight)
    },
    antennaTiltAngle () {
      return Math.min(
        this.maxAngle,
        Math.max(
          this.minAngle,
          +this.$getResource(this.antenna, 'tiltAngle', '0')
        )
      )
    },
    antennaAzimuth () {
      return Math.min(
        this.maxAngle,
        Math.max(
          this.minAngle,
          +this.$getResource(this.antenna, 'azimuth', '0')
        )
      )
    }
  },
  methods: {
    toggleCabinet (item) {
      const list = [...this.stationCabinetType]
      const index = list.indexOf(item)
      if (index >= 0) {
        list.splice(index, 1)
      } else {
        list.push(item)
      }
      this.handleStationChanged('cabinetType', list)
    },
    handleAMCChanged (field, value) {
      this.$store.dispatch('update', {
        object: this.amc,
        name: field,
        value: value + ''
      })
    },
    handleAntennaChanged (field, value) {
      this.$store.dispatch('update', {
        object: this.antenna,
        name: field,
        value: value + ''
      })
    },
    handleStationChanged (field, value) {
      this.$store.dispatch('update', {
        object: this.station,
        name: field,
        value: Array.isArray(value) ? value : (value + '')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.settings {
  margin-top: $base-offset * 2;
  flex-wrap: wrap;
  align-items: flex-start;

  &__group {
    min-width: 200px;
    margin: $base-offset;
    font-size: 0.8em;
    position: relative;
    padding: $base-offset;
    border-radius: $block-radius;
    border: 1px solid rgba(#fff, 0.1);

    $size: 10px;
    .mark {
      position: absolute;
      top: 0;
      transform: translateY(-50%);
      width: $size;
      height: $size;
      border-radius: 2px;
    }

    &::before {
      position: absolute;
      display: block;
      top: 0;
      left: $size * 1.5;
      transform: translateY(-50%);
      content: attr(data-caption);
      background-color: $page-background-color;
      padding: 0 $base-offset;
      font-weight: bold;
    }

    .option {
      min-height: 35px;
      justify-content: space-between;
      &::before {
        content: attr(data-caption);
        margin-right: $base-offset;
      }

      .button {
        margin: $base-offset / 2;
      }
    }
  }
}
</style>
