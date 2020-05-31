<template>
  <svg
    class="site-scheme"
    width="100%"
    height="100%"
    fill="none"
    version="1.1"
    viewBox="20.5 0 290 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g v-for="(point, index) in heightPoints" :key="point.offset + '_' + index">
      <line
        v-if="point.line"
        :x1="pointCaptionXOffset"
        :y1="point.offset"
        :x2="pointCaptionXOffset + 256"
        :y2="point.offset"
      />
      <text :x="pointCaptionXOffset" :y="point.offset + 1.5" class="overlay">{{ point.value }}</text>
      <text :x="pointCaptionXOffset" :y="point.offset + 1.5">{{ point.value }}</text>
    </g>

    <path id="heightAxis" :d="axisPath" />

    <g transform="translate(0, 5)">
      <component :is="groundComponent" />
    </g>

    <g transform="translate(21.75, 6.05)">
      <path
        id="layout"
        class="dummy"
        d="m112.09 41.161 25.788 37.69m-25.788-37.69v-17.853m0 17.853h25.788m-25.788 0 51.575 26.779m-51.575-26.779v26.779m51.575-26.779-25.788 37.69m25.788-37.69v-17.853m0 17.853h-25.788m25.788 0-51.575 26.779m51.575-26.779v26.779m-25.788 10.91 25.788-10.91m-25.788 10.91-25.788-10.91m25.788 10.91v3.9673m0-3.9673v-37.69m0 0v-17.853m-25.788 44.632h51.575m-51.575 0v14.877m51.575-14.877v14.877"
      />
      <component :is="constructionComponent" :class="{ 'dummy': !amc }" />
      <g v-if="amc" id="basis" transform="matrix(.99183 0 0 .99183 82.728 22.812)" fill="none">
        <path d="m29.6 45.5 26 11 26-11z" />
        <path d="m81.6 45.5-26.029-13.592-25.971 13.592z" />
      </g>
    </g>

    <g v-if="antennas.length >= 2">
      <g id="LC">
        <!-- - -->
        <line :x1="allPivots[0]" :y1="47.25" :x2="allPivots[1]" :y2="47.25" class="construct" />
        <!-- \ / 2 -->
        <line :x1="allPivots[0]" :y1="47" :x2="allPivots[1]" :y2="60.55" class="construct" />
        <!-- \ -->
        <line :x1="allPivots[0]" :y1="47" :x2="allPivots[1]" :y2="84.76" class="construct" />
      </g>
      <g id="RC">
        <!-- - -->
        <line :x1="allPivots[2]" :y1="47.25" :x2="allPivots[1]" :y2="47.25" class="construct" />
        <!-- \ / 2 -->
        <line :x1="allPivots[2]" :y1="47" :x2="allPivots[1]" :y2="60.55" class="construct" />
        <!-- \ -->
        <line :x1="allPivots[2]" :y1="47" :x2="allPivots[1]" :y2="84.76" class="construct" />
      </g>
    </g>

    <g v-for="(antenna, index) in antennas" :key="antenna.id + '_' + index">
      <line
        v-if="index < 3"
        :x1="pivots[index % 3]"
        :y1="27.26"
        :x2="pivots[index % 3]"
        :y2="84.76"
        class="construct"
      />
      <antenna-object
        :index="index"
        :width="antennaObjectWidth"
        :height="antennaObjectHeight"
        :offsetX="pivots[index % 3]"
        :offsetY="antennasHeightPoints[index].offset"
        :color="$getColor(index)"
        :description="antenna.description"
      />
    </g>
  </svg>
</template>

<script>
import CTNone from '@/components/scheme/CTNone'
import CTMain from '@/components/scheme/CTMain'
import CTReinforced from '@/components/scheme/CTReinforced'

import GTBuilding from '@/components/scheme/GTBuilding'
import GTGround from '@/components/scheme/GTGround'

import AntennaObject from '@/components/scheme/AntennaObject'
import { mapGetters } from 'vuex'

export default {
  name: 'SiteScheme',
  components: {
    'ct-none': CTNone,
    'ct-main': CTMain,
    'ct-reinforced': CTReinforced,
    'gt-building': GTBuilding,
    'gt-ground': GTGround,
    AntennaObject
  },
  props: {
    siteKey: String
  },
  created () {
    this.pointCaptionXOffset = 28.0
    this.axisLength = 235

    this.startAxisX = 21.096
    this.startAxisY = 238.93

    this.antennaObjectWidth = 8.0
    this.antennaObjectHeight = this.antennaObjectWidth * 2

    this.allPivots = []
    for (let i = 0; i < 3; i++) {
      this.allPivots[i] = 133.65 + i * 26
    }
  },
  computed: {
    ...mapGetters(['amc', 'antennas']),
    pivots () {
      const pivots = [...this.allPivots]

      if (this.antennas.length === 1) {
        return [pivots[1]]
      }

      if (this.antennas.length === 2) {
        return [pivots[0], pivots[2]]
      }

      return pivots
    },
    axisPath () {
      let path = `M${this.startAxisX} ${this.startAxisY}v-${this.axisLength}`
      for (const { offset } of this.heightPoints) {
        path += ` M${this.startAxisX} ${offset}h2`
      }
      return path
    },
    amcHeight () {
      return this.$getResource(this.amc, 'height', 0)
    },
    heightPoints () {
      const points = [
        {
          offset: this.createPoint(0).offset,
          value: this.amc ? '100 m' : '0 m'
        }
      ]

      if (!this.amc) {
        points.push({
          offset: this.createPoint(25).offset,
          value: '0 m',
          line: true
        })
      }

      const contains = value => !!points.find(point => point.value === value)

      for (const point of this.antennasHeightPoints) {
        !contains(point.value) && points.push(point)
      }

      points.push({
        offset: this.createPoint(this.amcHeight || 30).offset,
        value: `${this.amcHeight} m AMC`,
        line: true
      })

      return points
    },
    antennasHeightPoints () {
      return this.antennasHeights.map(this.createPoint)
    },
    constructionComponent () {
      const type = (
        this.$getResource(this.amc, 'groundingType') || ''
      ).toLowerCase()
      switch (type) {
        case 'ground':
          return 'gt-ground'
      }
      return 'gt-building'
    },
    groundComponent () {
      const type = (
        this.$getResource(this.amc, 'constructionType', 'none_concrete') || ''
      ).toLowerCase()

      switch (type) {
        case 'reinforced_concrete':
          return 'ct-reinforced'
        case 'main_concrete':
          return 'ct-main'
      }
      return 'ct-none'
    },
    antennasHeights () {
      return this.antennas.map(antenna =>
        this.$getResource(antenna, 'mountHeight', 0)
      )
    }
  },
  methods: {
    valueToOffset (value) {
      const height = this.amcHeight || 30
      if (!height) return 0

      const length = this.axisLength - 5
      value = Math.min(value, height)
      return length - (value / height) * length + (this.startAxisY - length)
    },
    createPoint (value) {
      return {
        value: value + ' m',
        offset: this.valueToOffset(value),
        line: true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.site-scheme {
  .construct,
  .antenna,
  path {
    stroke: $site-path-color !important;
    stroke-dasharray: none;
  }

  & > * {
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.2;
  }

  .construct,
  .antenna {
    stroke-width: 1;
  }

  .antenna {
    cursor: pointer;
  }

  #layout,
  #none_concrete {
    stroke: $faded-color !important;
  }

  line,
  .dummy {
    stroke: $faded-color !important;
    stroke-dasharray: 2.1748 5.43701;
  }

  text {
    fill: $site-path-color;
    font-size: 0.5em;

    &.overlay {
      stroke: #fff;
      stroke-width: 0.5em;
    }
  }
}
</style>
