// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@pinia/nuxt','@nuxt/ui','@nuxtjs/supabase','dayjs-nuxt'],
  supabase:{
    redirect:false
  },
  devServer: {
    host: '127.0.0.1'
  },
  dayjs: {
    locales: ['zh-cn'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'zh-cn',
    defaultTimezone: 'Asia/Shanghai',
  }
})
