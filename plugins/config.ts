import { Plugin } from '@nuxt/types';
import { Config, getConfig } from '../config';

const plugin: Plugin = (_, inject) => {
  const blogConfig = getConfig();
  inject('config', blogConfig);
};

export default plugin;

declare module 'vue/types/vue' {
  interface Vue {
    $blogConfig: Config
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $blogConfig: Config
  }
}
