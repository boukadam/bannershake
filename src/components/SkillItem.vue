<template>
  <v-card
      v-if="model"
      :title="model.name"
      hover
      :color="model.selected ? 'grey-lighten-2' : 'grey-darken-4'"
      :variant="model.selected ? 'flat' : 'outlined'"
      class="text-grey-darken-4"
      border
      @click="selectIt()"
  >
    <template v-slot:prepend>
      <img :alt="model.shortname" :src="`${BANNERSHAKE_API_URL}/img/${model.shortname}`" height="32" style="max-width: 72px"/>
    </template>
    <template v-slot:append>
      <v-icon v-if="model.selected" color="grey-darken-4">mdi-check-circle</v-icon>
    </template>
  </v-card>
</template>
<script setup lang="ts">
const BANNERSHAKE_API_URL = import.meta.env.VITE_BANNERSHAKE_API_URL ?? '/api';
const model = defineModel<Skill>()
defineProps<{
  selected: boolean
}>()
const emit = defineEmits(['selected'])
const selectIt = () => {
  if (model.value) {
    model.value.selected = !model.value.selected
    emit('selected', model)
  }
}
</script>