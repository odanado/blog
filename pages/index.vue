<template>
  <div>
    <article-card v-for="article in articles" :key="article.dir" :article="article" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { format } from 'date-fns'
import ArticleCard, { Article } from '../components/article-card.vue'

export default Vue.extend({
  components: {
    ArticleCard
  },
  async asyncData (app) {
    const contents = await app.$content('articles', { deep: true }).sortBy('publishAt', 'desc').fetch()
    return { contents }
  },
  data () {
    return {
      // TODO: fix type
      contents: [] as any[]
    }
  },
  computed: {
    articles (): Article[] {
      return this.contents.map((content) => {
        return {
          title: content.title,
          publishAt: format(content.publishAt, 'yyyy-MM-dd'),
          path: content.path,
          body: content.body
        }
      })
    }
  }
})
</script>
