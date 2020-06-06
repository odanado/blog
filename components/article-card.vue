<template>
  <section class="card">
    <div class="header">
      <span>{{ article.publishAt }}</span>
      <h3>
        <nuxt-link :to="article.path">
          {{ article.title }}
        </nuxt-link>
      </h3>
    </div>
    <p class="body" />
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type Article = {
  title: string;
  publishAt: string;
  path: string;
  body: string;
}

export default Vue.extend({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true
    }
  },
  mounted () {
    console.log(this.article);
  }
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: baseline;

  > * {
    padding: 0 4px;
  }
}
</style>
