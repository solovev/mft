<template functional>
  <svg
    fill="none"
    version="1.1"
    viewBox="0 0 17.2 15.2"
    xmlns="http://www.w3.org/2000/svg"
    :width="props.width"
    :height="props.height"
    :class="data.staticClass || ''"
  >
    <path
      d="m6.6 14.6h-6v-10m6 10v-10m0 10h3.5v-4.5c0-0.828 0.67-1.5 1.5-1.5v0c0.83 0 1.5 0.672 1.5 1.5v4.5h3.5v-10l-5-4m-5 4h-6m6 0 5-4m-11 4 5-4h6"
      class="stroke"
      :stroke="props.stroke"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.2"
    />/>
  </svg>
</template>

<script>
export default {
  functional: true,
  name: 'IndoorIcon',
  props: {
    width: String,
    height: String,
    stroke: String
  }
}
</script>
