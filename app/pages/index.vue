<template>
  <div>
    <article-card v-for="article in articles" :key="article.dir" :article="article" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ArticleCard from '../components/article-card.vue';
import { Article } from '../repositories/article.repository';

export default Vue.extend({
  components: {
    ArticleCard
  },
  async asyncData ({ app }) {
    const articles = await app.$repositories.article.fetchArticles();
    return {
      articles
    };
  },
  data () {
    return {
      contents: [] as Article[]
    };
  },
  head: {
    title: '記事一覧'
  }
});
</script>
