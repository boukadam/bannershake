<template>
  <v-select
      variant="outlined"
      hide-details
      :class="mobile ? 'my-2' : 'mb-2'"
      v-model="model"
      :items="logoSizes"
      :label="t('logoSize')"
      item-text="title"
      item-value="size"
  >
    <template v-slot:append>
        <v-icon :icon="icon" size="xx-large" color="black" class="pl-1 mr-2" theme="dark"/>
    </template>
  </v-select>
</template>
<script setup lang="ts">

import {useI18n} from "vue-i18n";
import {computed} from "vue";
import {useDisplay} from "vuetify";

const model = defineModel<string>({
  default: 'm'
})

const icon = computed(() => {
  if (model.value === 's') {
    return 'mdi-alpha-s-box'
  } else if (model.value === 'm') {
    return 'mdi-alpha-m-box'
  } else {
    return 'mdi-alpha-l-box'
  }
})
const {mobile} = useDisplay()
const {t} = useI18n()
const logoSizes = computed(() => [
  {
    title: t('smallLogoSize'),
    size: 's',
  },
  {
    title: t('mediumLogoSize'),
    size: 'm',
  },
  {
    title: t('largeLogoSize'),
    size: 'l',
  },
])

</script>
