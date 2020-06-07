<template>
  <section class="card">
    <div class="header">
      <span>{{ publishedAt }}</span>
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
    publishedAt () {
      return format(this.article.publishedAt, 'yyyy-MM-dd');
    }
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
