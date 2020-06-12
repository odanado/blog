import '@nuxt/types';

declare module 'vue/types/vue' {
  interface Vue {
    $isAmp: boolean;
  }
}
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    amp?: 'only' | 'hybrid' | boolean;
    ampLayout?: string | Function;
  }
}
