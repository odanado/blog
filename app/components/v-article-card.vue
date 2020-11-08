<template>
  <article>
    <a href="">
      <span class="date">{{ date }}</span>
      <span class="title">{{ title }}</span>
      <span class="description">{{ description }}</span>
    </a>
  </article>
</template>

<script lang="ts">
import Vue from 'vue';

export type Props = {
  data: string;
  title: string;
  description: string;
}

export default Vue.extend({
  props: {
    data: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }

});
</script>
