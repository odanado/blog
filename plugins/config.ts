import { Plugin } from '@nuxt/types';
import { Config, getConfig } from '../config';

const plugin: Plugin = (_, inject) => {
  const config = getConfig();
  inject('config', config);
};

export default plugin;

declare module 'vue/types/vue' {
  interface Vue {
    $config: Config
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $config: Config
  }
}
