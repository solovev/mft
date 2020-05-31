<template functional>
  <svg
    fill="none"
    version="1.1"
    viewBox="0 0 21.2 21.2"
    xmlns="http://www.w3.org/2000/svg"
    :width="props.width"
    :height="props.height"
    :class="data.staticClass || ''"
  >
    <path
      d="m10.6 2.1v-1.5m0 18.5v1.5m8.5-10h1.5m-18.5 0h-1.5m16-6 1-1m-1 13 1 1m-13-13-1-1m1 13-1 1m13-7c0 3.314-2.69 6-6 6s-6-2.686-6-6c0-3.314 2.69-6 6-6s6 2.686 6 6z"
      class="stroke"
      :stroke="props.stroke"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.2"
    />
  </svg>
</template>

<script>
export default {
  functional: true,
  name: 'OutdoorIcon',
  props: {
    width: String,
    height: String
  }
}
</script>
