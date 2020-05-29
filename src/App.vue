<template>
  <div id="app" class="row">
    <div class="column column--center">
      <textarea v-model="siteData" spellcheck="false" />
    </div>
    <div class="column column--center">
      <ul v-if="names.length > 1" class="row" data-caption="Sites:">
        <li
          v-for="site in names"
          :name="site"
          :key="site"
          :data-caption="site"
          class="button"
          :class="{ 'selected': site === currentSite }"
          @click="currentSite = site"
        />
      </ul>
      <Site :name="currentSite" />
    </div>
  </div>
</template>

<script>
import defaultData from '@/site.json'

import { mapGetters } from 'vuex'
import Site from '@/components/Site'

const defaultSite = 'A'
const wrapData = object => ({ [defaultSite]: object || {} })

export default {
  name: 'App',
  components: { Site },
  data () {
    return {
      siteData: '',
      currentSite: ''
    }
  },
  watch: {
    siteData: {
      handler (value) {
        let data
        try {
          data = JSON.parse(value)
        } catch (e) {}
        data = data || wrapData()
        this.$store.dispatch('setData', data)
      },
      immediate: true
    }
  },
  created () {
    this.currentSite = defaultSite
    this.siteData = JSON.stringify(wrapData(defaultData), null, 2)
  },
  computed: {
    ...mapGetters(['names'])
  }
}
</script>

<style lang="scss">
@import "@/styles/base.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  background-color: #222;
  height: 100%;
  align-items: stretch;

  & > div {
    padding: $base-offset * 4;
    flex: 1;

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

    ul {
      &::before {
        margin-right: $base-offset;
        content: attr(data-caption);
      }
    }

    li {
      margin: $base-offset / 2;
      &::before {
        content: attr(data-caption);
      }
    }
  }
}
</style>
