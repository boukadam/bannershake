<template>
  <v-select
      variant="outlined"
      hide-details
      :class="mobile ? 'my-2' : 'mb-2'"
      v-model="model"
      :items="bannerSizes"
      :label="t('bannerSize')"
      item-text="title"
      item-value="size"
  >
    <template v-slot:append>
      <FontAwesomeIcon :icon="icon" size="2xl" :class="mobile ? 'ml-1 mr-2': ''"/>
    </template>
  </v-select>
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {computed} from "vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {useDisplay} from "vuetify";

const model = defineModel<string>({
  default: 'l'
})

const icon = computed(() => {
  if (model.value === 'l') {
    return 'fa-brands fa-linkedin'
  } else if (model.value === 't') {
    return 'fa-brands fa-square-x-twitter'
  } else {
    return 'fa-brands fa-square-bluesky'
  }
})

const {mobile} = useDisplay()
const {t} = useI18n()
const bannerSizes = computed(() => [
  {
    title: t('linkedInBannerSize'),
    size: 'l'
  },
  {
    title: t('blueskyBannerSize'),
    size: 'b'
  },
  {
    title: t('twitterBannerSize'),
    size: 't'
  }
])
</script>