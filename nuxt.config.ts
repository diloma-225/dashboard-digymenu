// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/supabase'
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: ['/register', '/reset-password', '/forgot-password'],
      cookieRedirect: false,
    },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/fav-ico.png' },
      ]
    }
  },
  runtimeConfig: {
    public: {
      restaurantPageUrl: process.env.NUXT_PUBLIC_RESTAURANT_PAGE_URL,
    }
  },

  ssr:false
})