<template>
  <div id="app" class="row">
    <div class="column column--center">
      <textarea v-model="siteData" spellcheck="false" />
    </div>
    <div class="column column--center site-wrapper">
      <div class="row">
        <ul class="row site-picker" data-caption="Sites:">
          <li
            v-for="siteKey in (siteKeys.length > 0 ? siteKeys : ['A'])"
            :name="siteKey"
            :key="siteKey"
            :data-caption="siteKey"
            class="button"
            :class="{ 'selected': siteKey === selectedSite }"
            @click="$store.dispatch('selectSite', siteKey)"
          />
        </ul>
        <div class="row">
          <div class="button" @click="$store.dispatch('createStation')">+ Station</div>
          <div class="button" @click="$store.dispatch('removeStation')">- Station</div>
        </div>
        <div class="row" style="margin-left: 16px">
          <div class="button" @click="$store.dispatch('createAntenna')">+ Antenna</div>
          <div class="button" @click="$store.dispatch('removeAntenna')">- Antenna</div>
        </div>
      </div>
      <Site />
      <Settings />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Site from '@/components/Site'
import Settings from '@/components/Settings'
import debounce from 'lodash.debounce'

export default {
  name: 'App',
  components: { Site, Settings },
  watch: {
    siteData (value) {
      this.debouncedUpdateJSON.cancel()

      let data
      try {
        data = JSON.parse(value)
      } catch (e) {}
      data = data || {}

      this.$store.dispatch('setData', data)
    },
    sites (data) {
      this.debouncedUpdateJSON(data)
    }
  },
  data () {
    return {
      siteData: ''
    }
  },
  created () {
    this.debouncedUpdateJSON = debounce(this.updateJSON, 300)
    this.siteData = JSON.stringify({ ...this.sites }, null, 2)
  },
  computed: {
    ...mapState(['selectedSite', 'sites']),
    ...mapGetters(['siteKeys'])
  },
  methods: {
    updateJSON (data) {
      let value
      try {
        value = JSON.stringify(data, null, 2)
      } catch (e) {}
      value = value || this.siteData

      if (value === this.siteData || value === '{}') return

      this.siteData = value
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/base.scss";

#app {
  height: 100%;
  align-items: stretch;
  flex-wrap: wrap;

  .site-wrapper {
    flex: 3 !important;
    & > div:first-child {
      flex-wrap: wrap;
      margin-bottom: $base-offset;
      width: 748px;
    }

    .site-picker {
      flex: 1;

      &::before {
        margin-right: $base-offset;
        content: attr(data-caption);
      }

      & > li {
        margin: $base-offset / 2;
        &::before {
          content: attr(data-caption);
        }
      }
    }
  }

  & > div {
    padding: $base-offset * 4;
    flex: 2;

    textarea {
      width: 100%;
      height: 100%;
      min-width: 300px;
      background-color: #222;
      font-family: monospace;
      color: #eee;
      resize: none;
      border: 1px solid #333;
      outline: none;

      &:focus {
        border-color: $primary-color;
      }
    }
  }
}
</style>
