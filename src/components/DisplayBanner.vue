<template>
  <v-container v-if="generationResponse">
    <v-card v-if="generationResponse.offscreen.length > 0">
      <v-alert
          variant="text"
          color="orange darken-2"
          prominent
          icon="mdi-alert"
      >
        <p>{{ t("logosOffscreenAlert1") }}</p>
        <p v-html="t('logosOffscreenAlert2', {logosOffscreen: generationResponse.offscreen.join(', ')}, generationResponse.offscreen.length)"/>
      </v-alert>
    </v-card>
    <v-card class="mt-4" elevation="0" border color="grey-lighten-5">
      <div v-html="generationResponse.data"></div>
      <v-row class="pa-2">
        <v-col v-if="!mobile" cols="3"></v-col>
        <v-col v-if="!mobile" cols="4"></v-col>
        <v-col>
          <v-row>
            <v-col cols="6">
              <v-menu location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn color="grey-lighten-3" elevation="1" variant="flat" append-icon="mdi-menu-down" v-bind="props" block>
                    {{ t('copy-link') }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="copy('svg')" prepend-icon="mdi-svg">
                    <v-list-item-title>{{ t('copy-link-to-svg') }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="copy('editor')" prepend-icon="mdi-link-edit">
                    <v-list-item-title>{{ t('copy-link-to-editor') }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn color="green-darken-4" elevation="1" variant="flat" append-icon="mdi-menu-down" v-bind="props" block>
                    {{ t('download') }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="download('svg')" prepend-icon="mdi-svg">
                    <v-list-item-title>SVG</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="download('png')" prepend-icon="mdi-file-png-box">
                    <v-list-item-title>PNG</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-snackbar v-model="snackbar" timeout="8000">
      {{ snackbarText }}

      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar = false">
          {{ t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {ref} from "vue";
import {useDisplay} from "vuetify";

const props = defineProps<{
  generationResponse: BannerGenerationResponse
}>()

const snackbar = ref(false)
const snackbarText = ref('')

const {t} = useI18n()
const {mobile} = useDisplay()

const download = (type: 'png' | 'svg'): void => {
  const a = document.createElement("a")
  const source = '<?xml version="1.0" standalone="no"?>\r\n' + props.generationResponse.data
  const uriData = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source)
  if (type === 'svg') {
    a.href = uriData
    a.download = "skills-banner.svg"
    a.click()
    a.remove()
  } else if (type === 'png') {
    const img = new Image()
    img.src = uriData
    img.onload = () => {
      const canvas = document.createElement("canvas");
      [canvas.width, canvas.height] = [props.generationResponse.size.w, props.generationResponse.size.h]
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(img, 0, 0, props.generationResponse.size.w, props.generationResponse.size.h)
      }
      const a = document.createElement("a")
      const quality = 1.0
      a.href = canvas.toDataURL("image/png", quality)
      a.download = "skills-banner.png"
      a.append(canvas)
      a.click()
      a.remove()
    }
  }
}

const copy = (type: 'svg'|'editor'): void => {
  snackbarText.value = ''
  if (type === 'svg') {
    navigator.clipboard.writeText('https://bannershake.com/svg?' + props.generationResponse.query)
    snackbarText.value = t('copy-to-svg-done')
  } else if (type === 'editor') {
    navigator.clipboard.writeText('https://bannershake.com/?' + props.generationResponse.query)
    snackbarText.value = t('copy-to-editor-done')
  }
  snackbar.value = true
}
</script>