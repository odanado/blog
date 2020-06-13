<template>
  <div>
    <the-header />
    <nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { MetaInfo } from 'vue-meta';
import TheHeader from '../components/the-header.vue';

export default Vue.extend({
  components: {
    TheHeader
  },
  head (): MetaInfo {
    const path = this.$route.path.endsWith('/') ? this.$route.path.slice(0, -1) : `${this.$route.path}`;
    const canonical = `${this.$config.origin}${path}`;
    const link = [
      { rel: 'canonical', href: canonical }
    ];
    return {
      link
    };
  }
});
</script>

<style>
:root {
  --nc-ac-1: #a7cdfe;
  --nc-ac-tx: #000;
}
</style>
