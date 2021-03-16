<template>
  <v-card-title>
    <v-img :src="require('../assets/logo-white.png')" :max-width="$vuetify.breakpoint.xs ? 28 : 40"/>
    <span class="ml-2 text-md-h4 text-sm-h5 font-weight-bold">BannerShake</span>
    <v-spacer></v-spacer>
    <v-menu left offset-y>
      <template v-slot:activator="{ attrs, on }">
        <v-btn class="white--text" v-bind="attrs" v-on="on" text :small="$vuetify.breakpoint.xs">
          {{ $i18n.locale }} &#x25BC;
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="locale in getSupportedLocales" :key="locale.code" @click="$i18n.locale = locale.code">
          <v-list-item-icon class="mr-4">
            <country-flag :country="locale.flag" size="small"/>
          </v-list-item-icon>
          <v-list-item-title>{{ locale.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu offset-y close-on-content-click left max-width="300px">
      <template v-slot:activator="{ attrs, on }">
        <v-btn v-bind="attrs" v-on="on" icon>
          <v-icon :large="!$vuetify.breakpoint.xs">mdi-help-circle</v-icon>
        </v-btn>
      </template>
      <v-list class="body-2" rounded>
        <v-list-item href="https://github.com/boukadam/bannershake">
          <v-list-item-icon>
            <v-icon color="indigo">mdi-github</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('lastUpdate') }}</v-list-item-title>
            <span class="grey--text text--darken-2 font-italic mt-1">{{ lastCommitMessage }} </span>
            <small v-if="lastUpdate" class="font-weight-light">{{ lastUpdate }}</small>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="howItWorksDialog = true">
          <v-list-item-icon>
            <v-icon color="indigo">mdi-information</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('howItWorks.title') }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="feedbackDialog = true">
          <v-list-item-icon>
            <v-icon color="indigo">mdi-lightbulb-on</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('feedback.title') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <FeedbackDialog v-model="feedbackDialog"></FeedbackDialog>
    <HowItWorksDialog v-model="howItWorksDialog"></HowItWorksDialog>
  </v-card-title>
</template>
<script>
import FeedbackDialog from "@/components/FeedbackDialog";
import HowItWorksDialog from "@/components/HowItWorksDialog";
import moment from "moment";
import supportedLocales from "@/locales";

export default {
  components: {HowItWorksDialog, FeedbackDialog},
  data: () => ({
    feedbackDialog: false,
    howItWorksDialog: false,
    lastUpdate: null,
    lastCommitMessage: null
  }),
  mounted() {
    fetch("https://api.github.com/repos/boukadam/bannershake/commits/main")
        .then(response => response.json())
        .then(response => {
          this.lastUpdate = moment(response.commit.committer.date).fromNow();
          this.lastCommitMessage = response.commit.message;
        });
  },
  computed: {
    getSupportedLocales() {
      return supportedLocales;
    }
  }
}
</script>
