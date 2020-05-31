<template functional>
  <g
    id="ground"
    transform="matrix(.99183 0 0 .99183 82.728 22.812)"
    :class="[
      data.class,
      data.staticClass
    ]"
  >
    <path
      d="m52.6 54.54v124.08l3 1.96m-3-126.04 3 1.96m-3-1.96 3-1.96 3 1.96v124.08l-3 1.96m3-126.04-3 1.96v124.08"
    />
    <path
      d="m61.6 179.2c0 1.74-2.686 3.16-6 3.16s-6-1.42-6-3.16m12 0v25.23c0 1.74-2.686 3.15-6 3.15s-6-1.41-6-3.15v-25.23m12 0c0-1.09-1.059-2.05-2.667-2.62m-9.333 2.62c0-1.09 1.059-2.05 2.667-2.62"
    />
  </g>
</template>

<script>
export default {
  functional: true,
  name: 'GTGround'
}
</script>
