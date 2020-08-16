import { Plugin } from '@nuxt/types';
import { ArticleRepository } from '../repositories/article.repository';

export type Repositories = {
  article: ArticleRepository
}

const repositoryPlugin: Plugin = (context, inject) => {
  const articleRepository = new ArticleRepository(context.$content);
  const repositories: Repositories = {
    article: articleRepository
  };

  inject('repositories', repositories);
};

export default repositoryPlugin;

declare module 'vue/types/vue' {
  interface Vue {
    $repositories: Repositories;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $repositories: Repositories;
  }
}
