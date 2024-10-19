<template>
  <v-dialog v-model="model" scrollable max-width="800px" :fullscreen="mobile">
    <v-card max-height="700px">
      <div class="d-flex flex-row ma-4">
        <span class="text-h6">{{ t('howItWorks.title') }}</span>
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </div>
      <v-divider></v-divider>
      <v-card-text class="my-4 font-weight-light text-h6 text-justify">
        <p>
          {{ t('howItWorks.step1') }}
        </p>
        <p>
          {{ t('howItWorks.step2') }}
        </p>
        <p>
          {{ t('howItWorks.step3') }}
        </p>
        <p>
          {{ t('howItWorks.example1') }}
        </p>
        <p>
          <v-img :src="wafoodBanner"/>
        </p>
        <p>
          {{ t('howItWorks.example2') }}
        </p>
        <v-img :src="boukadamBanner"/>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" variant="text" x-large @click="closeDialog">{{ t('howItWorks.gotIt') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import wafoodBanner from '../static/examples/wafood-skills-banner.png'
import boukadamBanner from '../static/examples/boukadam-banner.png'
import {useDisplay} from "vuetify";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const {mobile} = useDisplay()
const model = defineModel<boolean>()
const closeDialog = () => {
  model.value = false
}
</script>