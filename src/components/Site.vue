<template>
  <div class="site">
    <div class="site__header">Site {{ siteKey }}</div>
    <div class="site__content">
      <div class="row header">
        <h2 class="item-shrink ellipsis">Площадка {{ site.name || '...' }}</h2>
        <component :is="coverTypeIcon" class="snuggle-right item-solid" width="26" height="26" />
      </div>
      <div class="location-data">
        <div class="row">
          <div class="ellipsis">№ {{ siteNumber || '...' }} {{ siteAddress.address }}</div>
          <div
            v-if="siteLocation.latitude"
            class="snuggle-right item-solid"
          >{{ siteLocation.latitude }}</div>
        </div>
        <div class="row">
          <div class="location-data__town ellipsis" v-text="siteAddress.town || '...'" />
          <div
            v-if="siteLocation.longitude"
            class="snuggle-right item-solid"
          >{{ siteLocation.longitude }}</div>
        </div>
      </div>
      <div class="main-data row">
        <div class="site__scheme">
          <site-scheme :siteKey="siteKey" />
        </div>
        <div class="site__params column">
          <station-picker />
          <sector-selector :antennas="antennas" />
          <communication-list :dummy="!antennas.length" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import IndoorIcon from '@/components/icons/IndoorIcon'
import OutdoorIcon from '@/components/icons/OutdoorIcon'
import StationPicker from '@/components/StationPicker'
import CommunicationList from '@/components/CommunicationList'
import SectorSelector from '@/components/SectorSelector'
import SiteScheme from '@/components/scheme/SiteScheme'

export default {
  name: 'Site',
  components: {
    IndoorIcon,
    OutdoorIcon,
    StationPicker,
    CommunicationList,
    SectorSelector,
    SiteScheme
  },
  computed: {
    ...mapState(['selectedStationIndex']),
    ...mapState({
      siteKey: 'selectedSite'
    }),
    ...mapGetters(['site', 'station', 'antennas']),
    siteNumber () {
      return this.$getResource(this.site, 'siteNumber')
    },
    siteLocation () {
      return {
        latitude: this.$getResource(this.site, 'latitude', 0),
        longitude: this.$getResource(this.site, 'longitude', 0)
      }
    },
    siteAddress () {
      const n = 2
      const trim = value => value.trim()
      const join = value => value.join(', ')

      const value = this.$getResource(this.site, 'siteAddress', '')
      const split = value.split(',').map(trim)

      const address = split.slice(Math.max(split.length - n, 0))
      const town = split.slice(0, -n)
      return {
        town: join(town),
        address: join(address)
      }
    },
    stationCoverType () {
      return this.$getResource(this.station, 'coverType', 'OUTDOOR')
    },
    coverTypeIcon () {
      return this.stationCoverType.toLowerCase() + '-icon'
    }
  }
}
</script>

<style scoped lang="scss">
.site {
  font-family: Arial, Helvetica, sans-serif;
  padding-top: 0;
  background-color: #fff;
  color: $site-path-color;
  width: 100%;
  max-width: 748px;
  border: 1px solid #333;
  font-size: 0.9em;

  &__scheme {
    width: 60%;
  }

  &__params {
    width: 40%;
    justify-content: space-between;
    padding: $base-offset * 6 0 0;
  }

  &__header {
    background-color: $site-path-color;
    color: #fff;
    display: inline-block;
    padding: $base-offset;
    min-width: 60px;
    text-align: center;
  }

  &__content {
    padding: $base-offset * 4;

    .header {
      margin-bottom: $base-offset;
      h2 {
        margin: 0;
      }
    }

    .main-data {
      align-items: stretch;
      margin-top: $base-offset * 2;
    }

    .location-data {
      &__town {
        color: $faded-text-color;
      }

      & > div {
        &:last-child {
          margin-top: $base-offset / 2;
        }
      }
    }
  }
}
</style>
