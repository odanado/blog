import { defineNuxtModule } from '@nuxtjs/composition-api';
import { ArticleRepository } from '../repositories/article.repository';

export default defineNuxtModule(function () {
  const { $content } = require('@nuxt/content');
  const articleRepository = new ArticleRepository($content);

  this.nuxt.hook('sitemap:generate:before', async (_: unknown, sitemapOptions: any) => {
    const articles = await articleRepository.fetchArticles();
    const paths = articles.map(article => article.path);
    sitemapOptions[0].routes = [...(sitemapOptions[0].routes || []), ...paths];
  });
});
