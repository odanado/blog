<template>
  <div>
    <the-header />
    <nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TheHeader from '../components/the-header.vue';

export default Vue.extend({
  components: {
    TheHeader
  }
});
</script>

<style>
:root {
  --nc-ac-1: #a7cdfe;
  --nc-ac-tx: #000;
}
</style>
