<template>
  <div class="site">
    <div class="site__header">Site {{ name }}</div>
    <div class="site__content"></div>
  </div>
</template>

<script>
export default {
  name: 'Site',
  props: {
    name: String
  }
}
</script>

<style scoped lang="scss">
.site {
  font-family: Arial, Helvetica, sans-serif;
  $c: rgb(44, 44, 44);
  padding-top: 0;
  background-color: #fff;
  color: $c;
  min-width: 600px;
  border: 1px solid #333;
  font-size: 0.9em;

  &__header {
    background-color: $c;
    color: #fff;
    display: inline-block;
    padding: $base-offset;
    min-width: 60px;
    text-align: center;
  }

  &__content {
    padding: $base-offset * 2;
  }
}
</style>
