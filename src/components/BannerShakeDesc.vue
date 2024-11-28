<template>
  <v-row align="center">
    <div :class="mobile ? mobileStyle : defaultStyle">
      <div v-html="t('bannerShakeDesc')"></div>
      <div v-html="t('bannerShakeDescCount', {count: count})" class="mt-3"></div>
    </div>
  </v-row>
</template>
<script setup lang="ts">
import {useDisplay} from "vuetify";
import {useI18n} from "vue-i18n";

defineProps<{
  count: Number
}>()
const {t} = useI18n()
const {mobile} = useDisplay()
const defaultStyle = "py-4 ml-2 mb-4 font-weight-light text-justify text-h5"
const mobileStyle = "mx-2 mb-2 font-weight-light text-justify text-md-h5 text-h6"

</script>
