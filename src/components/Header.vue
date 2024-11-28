<template>
  <div class="d-flex flex-row ma-4">
    <v-img :src="logoBlack" :max-width="mobile ? 28 : 40"/>
    <span v-if="mobile" class="ml-2 text-h5 font-weight-bold">BannerShake</span>
    <span v-else class="ml-2 text-h4 font-weight-bold">BannerShake</span>
    <v-spacer></v-spacer>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn class="white--text" v-bind="props" variant="text" :small="mobile">
          {{ locale }} &#x25BC;
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="locale in supportedLocales" :key="locale.code" @click="changeLocale(locale.code)">
          <template v-slot:prepend>
            <CountryFlag :country="locale.flag" size="small"/>
          </template>
          <v-list-item-title class="ml-3">{{ locale.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu offset-y close-on-content-click location="bottom" max-width="300px">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" variant="text">
          <v-icon size="x-large" icon="mdi-help-circle" />
        </v-btn>
      </template>
      <v-list class="body-2" rounded>
        <v-list-item href="https://github.com/boukadam/bannershake" class="my-2">
          <template v-slot:prepend>
            <v-icon>mdi-github</v-icon>
          </template>
          <v-list-item-title>{{ t('lastUpdate') }}</v-list-item-title>
          <v-list-item-subtitle>
            <span class="grey--text text--darken-2 font-italic mt-1">{{ lastCommitMessage }} </span>
            <small v-if="lastUpdate" class="pl-1 ">/ {{ lastUpdate }}</small>
          </v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="howItWorksDialog = true" class="my-2">
          <template v-slot:prepend>
            <v-icon>mdi-information</v-icon>
          </template>
          <v-list-item-title>{{ t('howItWorks.title') }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="feedbackDialog = true">
          <template v-slot:prepend>
            <v-icon>mdi-lightbulb-on</v-icon>
          </template>
          <v-list-item-title>{{ t('feedback.title') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <HowItWorksDialog v-model="howItWorksDialog"></HowItWorksDialog>
    <FeedbackDialog v-model="feedbackDialog"></FeedbackDialog>
  </div>
</template>
<script setup lang="ts">
import {useDisplay} from "vuetify";
import logoBlack from '../assets/logo-black.png'
import CountryFlag from 'vue-country-flag-next'
import {useI18n} from "vue-i18n";
import supportedLocales from "../locales/index.ts"
import HowItWorksDialog from "./HowItWorksDialog.vue";
import FeedbackDialog from "./FeedbackDialog.vue";
import {onMounted, ref} from "vue";

const lastUpdate = ref("")
const lastCommitMessage = ref("")

onMounted(() => {
  fetch("https://api.github.com/repos/boukadam/bannershake/commits/main")
      .then(response => response.json())
      .then(response => {
        lastUpdate.value = timeAgo(response.commit.committer.date);
        lastCommitMessage.value = response.commit.message;
      });
})

const changeLocale = (newLocale: string) => locale.value = newLocale

const {mobile} = useDisplay()
const {t, locale} = useI18n({ useScope: 'global' });
const howItWorksDialog = ref(false)
const feedbackDialog = ref(false)

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  const interval = Math.floor(seconds / 60);

  if (interval < 1) {
    return "just now";
  }
  if (interval < 60) {
    return interval + "min ago";
  }
  const hours = Math.floor(interval / 60);

  if (hours == 1) {
    return "last hour";
  }
  if (hours < 24) {
    return hours + " hours ago";
  }

  const days = Math.floor(hours / 24);

  if (days == 1) {
    return "yesterday";
  }
  if (days < 7) {
    return days + " days ago";
  }

  const weeks = Math.floor(days / 7);

  if (weeks == 1) {
    return "last week";
  }
  if (weeks < 4) {
    return weeks + " weeks ago";
  }

  const months = Math.floor(days / 30);

  if (months == 1) {
    return "last month";
  }
  if (months < 12) {
    return months + " months ago";
  }

  const years = Math.floor(days / 365);

  if (years == 1) {
    return "last year";
  }

  return years + " years ago";
}
</script>