<template>
  <rect
    :x="offsetX - (width * scale) / 2"
    :y="offsetY - (height * scale) / 2"
    :width="(width * scale)"
    :height="(height * scale)"
    :fill="color"
    class="antenna"
    :class="{ 'selected': isSelected }"
    rx="2"
    @mouseenter="handleHover"
    @mouseleave="handleHover"
    @click="$store.dispatch('selectAntenna', index)"
  >
    <title v-if="description">{{ description }}</title>
  </rect>
</template>

<script>
import { mapState } from 'vuex'
import Velocity from 'velocity-animate'

export default {
  name: 'AntennaObject',
  props: {
    index: Number,
    width: Number,
    height: Number,
    offsetX: Number,
    offsetY: Number,
    color: String,
    description: String
  },
  watch: {
    isSelected: {
      handler (value, previousValue) {
        if (!previousValue && value) {
          this.scale = 1.2
        } else if (previousValue && !value) {
          this.scale = 1.0
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      scale: 1.0
    }
  },
  created () {},
  computed: {
    ...mapState(['selectedAntennaIndex']),
    isSelected () {
      return this.index === this.selectedAntennaIndex
    }
  },
  methods: {
    handleHover (e) {
      const { target, type } = e
      const isHover = type === 'mouseenter'
      if (this.isSelected) return

      if (isHover) {
        Velocity(target, 'finish')
        Velocity(
          target,
          { tween: [1.2, 1.0] },
          {
            duration: 150,
            progress: (elements, complete, remaining, start, tweenValue) => {
              this.scale = tweenValue
            }
          }
        )
      } else {
        Velocity(target, 'reverse')
      }
    }
  }
}
</script>
