<template>
  <section class="card">
    <div class="header">
      <span class="date">{{ publishedAt }}</span>
      <h3 class="title">
        <nuxt-link :to="article.path">
          {{ article.title }}
        </nuxt-link>
      </h3>
    </div>
    <p class="body" />
  </section>
</template>

<script lang="ts">
import { format } from 'date-fns';
import Vue, { PropType } from 'vue';
import { Article } from '../repositories/article.repository';

export default Vue.extend({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true
    }
  },
  computed: {
    publishedAt (): string {
      return format(this.article.publishedAt, 'yyyy-MM-dd');
    }
  }
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: baseline;

  .date {
    flex: 0 1 120px;
  }

  .title {
    flex: 0 2 100%;
  }

  > * {
    padding: 0 4px;
  }
}
</style>
