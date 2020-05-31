<template>
  <div class="selector row">
    <svg :width="this.size + 'px'" :height="this.size + 'px'" class="item-solid">
      <path
        v-for="(antenna, i) in list"
        :key="antenna.id"
        :d="pathes[i]"
        :fill="$getColor(i)"
        :data-azimuth="angles[i]"
        @click="move(i)"
        @mouseenter="handleSectorHover($event)"
        @mouseleave="handleSectorHover($event)"
        class="sector"
        :class="{ 'selected': value === i }"
      >
        <title v-if="antenna.description">{{ antenna.description }}</title>
      </path>
      <template v-if="empty">
        <path v-for="i in 3" :d="getPath(i * 60, sectorRadius, 80)" :key="i" class="faded" />
      </template>
      <circle
        :cx="this.size / 2"
        :cy="this.size / 2"
        :r="this.size / 11"
        :class="{ 'faded': empty }"
      />
    </svg>
    <div class="selector__info">
      <div class="row">
        <div
          class="move"
          :class=" { 'move--hidden': empty || value === 0 }"
          @click="move(value - 1)"
        >◂</div>
        <div class="ellipsis item-stretch text-center">Сектор {{ selectedAntenna.id || '...' }}</div>
        <div
          class="move"
          :class=" { 'move--hidden': empty || value === list.length - 1 }"
          @click="move(value + 1)"
        >▸</div>
      </div>
      <div class="row data-row">
        <svg class="item-solid" viewBox="0 0 10.2 10.2">
          <path d="m8.6 5.6c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" fill="#11df71" />
          <path
            d="m4.6 5.6 5-5m-1 5c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"
            stroke="#2c2c2c"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.2"
          />
        </svg>
        <div class="snuggle-right">{{ antennaInfo.azimuth }}°</div>
      </div>
      <div class="row data-row">
        <svg class="item-solid" viewBox="0 0 9.2 9.2">
          <path
            d="m0.6 7.6v-4.33c2.95 0 5.33 2.38 5.33 5.33h-4.33c-0.55 0-1-0.45-1-1z"
            fill="#ffb932"
          />
          <path
            d="m0.6 0.6v7c0 0.55 0.45 1 1 1h7m-8-5.33c2.95 0 5.33 2.38 5.33 5.33"
            stroke="#2c2c2c"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.2"
          />
        </svg>
        <div class="snuggle-right">{{ antennaInfo.tiltAngle }}°</div>
      </div>
      <div class="row data-row">
        <svg class="item-solid" viewBox="0 0 7.2 10.2">
          <path
            d="m3.6 0.6h-3m3 0h3m-3 0v9m-3 0h3m3 0h-3"
            stroke="#2c2c2c"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.2"
          />
        </svg>
        <div class="snuggle-right">{{ antennaInfo.mountHeight }} m</div>
      </div>
    </div>
  </div>
</template>

<script>
import Velocity from 'velocity-animate'

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  }
}

export default {
  name: 'SectorSelector',
  props: {
    antennas: Array
  },
  created () {
    this.size = 75
    this.sectorRadius = this.size / 3
    this.selectedSectorRadius = this.size / 2.5
  },
  computed: {
    value () {
      return this.$store.state.selectedAntennaIndex
    },
    empty () {
      return !this.list.length
    },
    list () {
      return this.antennas || []
    },
    angles () {
      return this.list.map(antenna => this.$getResource(antenna, 'azimuth'))
    },
    pathes () {
      return this.angles.map((angle, index) => {
        let radius = this.sectorRadius
        if (index === this.value) {
          radius = this.selectedSectorRadius
        }
        return this.getPath(angle, radius)
      })
    },
    selectedAntenna () {
      return this.list[this.value] || {}
    },
    antennaInfo () {
      return {
        tiltAngle: (+this.$getResource(this.selectedAntenna, 'tiltAngle', 0)).toFixed(1),
        azimuth: (+this.$getResource(this.selectedAntenna, 'azimuth', 0)).toFixed(1),
        mountHeight: this.$getResource(this.selectedAntenna, 'mountHeight', 0)
      }
    }
  },
  methods: {
    move (to) {
      this.$store.dispatch('selectAntenna', Math.max(0, Math.min(to, this.list.length - 1)))
    },
    handleSectorHover (e) {
      const { type, target } = e
      const azimuth = target.getAttribute('data-azimuth')
      if (!azimuth) return

      const isSelected = target.classList.contains('selected')
      if (isSelected) return

      const isHover = type === 'mouseenter'
      if (isHover) {
        Velocity(target, 'finish')
        Velocity(
          target,
          { tween: [this.selectedSectorRadius, this.sectorRadius] },
          {
            duration: 150,
            progress: (elements, complete, remaining, start, tweenValue) => {
              const value = this.getPath(azimuth, tweenValue)
              elements[0].setAttribute('d', value)
            }
          }
        )
      } else {
        Velocity(target, 'reverse')
      }
    },
    getPath (angle, r, tiltAngle) {
      tiltAngle = tiltAngle || 60
      const pad = 2

      angle = angle * 2 - tiltAngle / 2
      const startAngle = angle + pad
      const endAngle = angle + tiltAngle - pad

      const x = this.size / 2
      const y = this.size / 2
      r = r || this.sectorRadius

      const start = polarToCartesian(x, y, r, endAngle)
      const end = polarToCartesian(x, y, r, startAngle)

      const arcSweep = endAngle - startAngle <= 180 ? '0' : '1'

      const d = [
        'M',
        start.x,
        start.y,
        'A',
        r,
        r,
        0,
        arcSweep,
        0,
        end.x,
        end.y,
        'L',
        x,
        y,
        'L',
        start.x,
        start.y
      ].join(' ')

      return d
    }
  }
}
</script>

<style lang="scss" scoped>
.selector {
  align-items: flex-start;

  .move {
    cursor: pointer;

    &--hidden {
      visibility: hidden;
    }
  }

  &__info {
    flex: 1;
    margin-left: $base-offset * 2;

    .data-row {
      margin-top: $base-offset * 1.5;

      $height: 14px;
      & > div {
        line-height: $height;
      }

      & > svg {
        width: $height;
        height: $height;
        fill: none;
      }
    }
  }

  .faded {
    fill: $faded-color;
  }

  circle {
    fill: rgb(17, 223, 113);
  }

  .sector {
    cursor: pointer;
    &.selected {
      stroke: $site-path-color;
    }
  }
}
</style>
