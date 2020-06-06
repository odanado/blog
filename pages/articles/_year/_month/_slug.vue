<template>
  <article>
    <nuxt-content :document="content" />
  </article>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  async asyncData (app) {
    const { year, month, slug } = app.params;
    const path = ['articles', year, month, slug].join('/');
    const content = await app.$content(path).fetch();

    return { content };
  }
});
</script>
