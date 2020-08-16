<template>
  <article>
    <h1>{{ article.title }}</h1>
    <nuxt-content :document="article" />
  </article>
</template>

<script lang="ts">
import Vue from 'vue';
import { MetaInfo } from 'vue-meta';
import { Article } from '../../../../repositories/article.repository';

export default Vue.extend({
  async asyncData ({ app, params }) {
    const { year, month, slug } = params;

    const article = await app.$repositories.article.fetchArticle(year, month, slug);

    return { article };
  },
  data () {
    return {
      article: {} as Article
    };
  },
  head (): MetaInfo {
    const description = this.article.bodyText.slice(0, 90);
    return {
      title: this.article.title,
      meta: [
        { hid: 'description', name: 'description', content: description },
        {
          property: 'og:title',
          content: this.article.title
        },
        {
          property: 'og:description',
          content: description
        },
        {
          property: 'og:type',
          content: 'website'
        },
        { name: 'twitter:card', content: 'summary' }
      ]
    };
  }
});
</script>
