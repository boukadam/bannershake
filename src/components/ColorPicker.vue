<template>
  <v-text-field v-model="model" :label="$t('backgroundColor')" hide-details variant="outlined" class="ma-0 pa-0">
  <template v-slot:append>
    <v-menu v-model="colorPickerMenu" top nudge-bottom="105" nudge-left="16" >
      <template v-slot:activator="{ props }">
        <div :style="swatchStyle" v-bind="props"/>
      </template>
      <v-card>
        <v-card-text class="pa-0">
          <v-color-picker v-model="model" show-swatches hide-inputs hide-sliders flat light mode="hex" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" variant="text" large @click="colorPickerMenu = false">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </template>
  </v-text-field>
</template>
<script setup lang="ts">

import {computed, ref} from "vue";

const model = defineModel<string>({
  default: "#FFFFEF"
})

const colorPickerMenu = ref(false)

const swatchStyle = computed(() => {
  return {
    backgroundColor: model.value,
    cursor: 'pointer',
    height: '40px',
    width: '40px',
    borderRadius: colorPickerMenu.value ? '50%' : '4px',
    border: 'solid',
    borderWidth: 'thin',
    transition: 'border-radius 200ms ease-in-out',
    marginBottom: '4px'
  }
})
</script>
