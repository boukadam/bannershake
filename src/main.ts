import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Notifications from '@kyvg/vue3-notification'

import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

import {createI18n} from "vue-i18n";

const i18n = createI18n({
    locale: 'en',
    legacy: false,
    warnHtmlMessage: false,
    messages: {
        en,
        es,
        fr
    }
})

// Vuetify
import 'vuetify/styles'
import {createVuetify, ThemeDefinition} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import "@mdi/font/css/materialdesignicons.css";

const myCustomLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#F5F5F5',
        surface: '#FFFFFF',
        primary: '#6200EE',
        'primary-darken-1': '#3700B3',
        secondary: '#03DAC6',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
    },
}

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'myCustomLightTheme',
        themes: {
            myCustomLightTheme,
        },
    }
})


import { createPinia } from 'pinia'
const pinia = createPinia()

import ScriptX from 'vue-scriptx'
import Adsense from 'vue-google-adsense/dist/Adsense.min.js'
import InArticleAdsense from 'vue-google-adsense/dist/InArticleAdsense.min.js'
import InFeedAdsense from 'vue-google-adsense/dist/InFeedAdsense.min.js'

createApp(App)
    .use(i18n)
    .use(Notifications)
    .use(vuetify)
    .use(pinia)
    .use(ScriptX)
    .use(Adsense)
    .use(InArticleAdsense)
    .use(InFeedAdsense)
    .mount('#app')
