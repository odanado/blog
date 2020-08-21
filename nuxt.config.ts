import { join } from 'path';
import { getConfig } from './app/config';
const config = getConfig();

/** @type {import('@nuxt/types').Configuration} */
export default {
  srcDir: 'app',
  server: {
    port: config.port,
    host: config.host
  },
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - odan blog',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@exampledev/new.css/new.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/config',
    '~/plugins/repository'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxt/content', {
      dir: join(process.cwd(), 'content')
    }],
    '~/modules/sitemap',
    ['@nuxtjs/sitemap', { hostname: config.origin }],
    '@nuxtjs/robots'
  ],
  /*
  ** Build configuration
  */
  build: {
  },
  env: {
    ORIGIN: config.origin
  }
};
