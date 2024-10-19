<template>
  <v-text-field v-debounce:300ms="fetchImage" v-model="model" :label="$t('brandImage')" hide-details variant="outlined" class="mb-2">
    <template v-slot:append>
      <v-avatar v-if="image">
        <v-img :src="image" sizes="36" alt="?">
          <template v-slot:error>
            <v-img :src="logoBlack"  />
          </template>
        </v-img>
      </v-avatar>
      <v-icon v-else icon="mdi-link-variant" size="xx-large" color="black" class="pl-1 mr-2" theme="dark"/>
    </template>
  </v-text-field>
</template>
<script setup lang="ts">
import vueDebounce from 'vue-debounce'
import {Ref, ref} from "vue";
import logoBlack from '../static/logo-black.png'

const vDebounce = vueDebounce({ lock: true })
const model = defineModel<string|undefined>()
const image: Ref<string|undefined> = ref(undefined)

const fetchImage = async () => {
  image.value = model.value
}

</script>
