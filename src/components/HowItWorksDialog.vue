<template>
  <v-dialog v-model="model" scrollable max-width="800px" :fullscreen="mobile">
    <v-card max-height="700px">
      <div class="d-flex flex-row ma-4">
        <span class="text-h6">{{ t('howItWorks.title') }}</span>
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </div>
      <v-divider></v-divider>
      <v-card-text class="font-weight-light text-h6 text-justify">
        <p class="px-0 py-2">
          {{ t('howItWorks.step1') }}
        </p>
        <p class="px-0 py-2">
          {{ t('howItWorks.step2') }}
        </p>
        <p class="px-0 py-2">
          {{ t('howItWorks.step3') }}
        </p>
        <div class="text-h5 font-weight-bold my-4">Examples </div>
        <v-card class="mb-8" v-for="example in examples">
          <v-img :src="'https://bannershake.com/svg?' + example.query"/>
          <v-card-title>{{ example.title }}</v-card-title>
          <v-card-text>{{ example.description }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green-darken-4" @click="showWebsite(example)">{{ t("howItWorks.learnMore") }}</v-btn>
            <v-btn color="green-darken-4" @click="showInEditor(example)">{{ t("howItWorks.show") }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-4" variant="text" x-large @click="closeDialog">{{ t('howItWorks.gotIt') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import examples from '/examples/data.json'
import {useDisplay} from "vuetify";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const {mobile} = useDisplay()
const model = defineModel<boolean>()
const closeDialog = () => {
  model.value = false
}
const showWebsite = (example: Example) => {
  window.open(example.website, '_blank')
}
const showInEditor = (example: Example) => {
  window.open('https://bannershake.com/?' + example.query, '_blank')
}
</script>