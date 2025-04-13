// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  runtimeConfig: {
    public: {
      apiPath: process.env.API_PATH,
      wsPath:  process.env.WS_PATH
    },
  },
  tailwindcss: {
    configPath: '@/tailwind.config.ts',
    viewer: false,
  },
  colorMode: { preference: 'light' },
  ssr: false,

})
