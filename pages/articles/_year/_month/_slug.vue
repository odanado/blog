<template>
  <article>
    <nuxt-content :document="article" />
  </article>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  async asyncData ({ app, params }) {
    const { year, month, slug } = params;

    const article = await app.$repositories.article.fetchArticle(year, month, slug);

    return { article };
  }
});
</script>
