<template>
  <v-app>
    <notifications/>
    <v-card color="grey-lighten-4" flat tile dark>
      <GithubCorner/>
      <v-card color="grey-lighten-4" flat tile dark max-width="1200px" class="mx-auto">
        <Header/>
        <!-- Form -->
        <v-card-text class="mt-6">

          <!-- Description -->
          <BannerShakeDesc/>

          <!-- Skills selector -->
          <v-row class="px-3 pt-2">
            <SkillSelector v-model="selection" :skills="skillsStore.skills"/>
          </v-row>

          <v-divider v-if="mobile" class="mt-2 mb-7" />

          <!-- Filter row -->
          <v-row align="center" justify="center">
            <v-col :cols="mobile ? 12 : 3" class="py-0">
              <BrandImageSelector v-model="brandImage"/>
            </v-col>

            <v-col :cols="mobile ? 12 : 3" class="py-0">
              <LogoSizeSelector v-model="logoSize"/>
            </v-col>

            <v-col :cols="mobile ? 12 : 3" class="py-0">
              <BannerSizeSelector v-model="bannerSize"/>
            </v-col>

            <v-col :cols="mobile ? 12 : 3" :class="mobile ? 'pb-0' : 'pb-5'">
              <ColorPicker v-model="backgroundColor"/>
            </v-col>
          </v-row>

        </v-card-text>
        <!-- Action row -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-col v-if="!mobile">
            <v-img :src="getYourBanner" class="ma-0 pa-0"/>
          </v-col>
          <v-col :cols="mobile ? 12 : 3">
            <v-btn
                variant="flat"
                size="x-large"
                color="green-darken-4"
                :disabled="selection.length === 0"
                @click="generate"
                :x-large="!mobile"
                block
                :loading="generationBeingProcessed"
            >
              {{ t('generate') }}
            </v-btn>
            <v-tooltip v-if="selection.length === 0" activator="parent" location="start">{{ t('selectSkills') }}</v-tooltip>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-card>
    <!-- Skills banner display -->
    <v-container style="max-width: 1200px" class="mb-16">
      <DisplayBanner v-if="generationResponse" :generation-response="generationResponse"/>
      <Adsense
          data-ad-client="ca-pub-1141710729116590"
          data-ad-slot="4082798700">
      </Adsense>
      <div ref="banner"></div>
    </v-container>
    <Footer/>
  </v-app>
</template>

<script setup lang="ts">
import Adsense from "vue-google-adsense"
import {Notifications} from "@kyvg/vue3-notification";
import GithubCorner from "./components/GithubCorner.vue";
import Header from "./components/Header.vue";
import BannerShakeDesc from "./components/BannerShakeDesc.vue";
import SkillSelector from "./components/SkillSelector.vue";
import ColorPicker from "./components/ColorPicker.vue";
import {useSkillsStore} from "./store.ts";
import {useDisplay} from "vuetify";
import {Ref, ref} from "vue";
import BrandImageSelector from "./components/BrandImageSelector.vue";
import LogoSizeSelector from "./components/LogoSizeSelector.vue";
import BannerSizeSelector from "./components/BannerSizeSelector.vue";
import {useI18n} from "vue-i18n";
import DisplayBanner from "./components/DisplayBanner.vue";
import {useApiClient} from "./composables/apiClient.ts";
import getYourBanner from './static/get-your-banner.svg'
import Footer from "./components/Footer.vue";

import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {faTwitter, faLinkedin, faSquareXTwitter} from '@fortawesome/free-brands-svg-icons'

library.add(fas, faTwitter, faLinkedin, faSquareXTwitter)

const urlParams = new URLSearchParams(window.location.search);
const skillsFromQuery = urlParams.get('s')
const brandFromQuery = urlParams.get('b')
const colorFromQuery = urlParams.get('c')
const logoSizeFromQuery = urlParams.get('ls')
const bannerSizeFromQuery = urlParams.get('bs')

const skillsStore = useSkillsStore()
const {mobile} = useDisplay()
const {t} = useI18n()

const initSelection = (shortnames: string | null): Skill[] => {
  if (!!shortnames) {
    const skillsArrayFromQuery = shortnames?.split(',')
    console.log(skillsArrayFromQuery)
    let selected = skillsStore.skills.filter(skill => skillsArrayFromQuery.includes(skill.shortname));
    selected.forEach(skill => {
      skill.selected = true
    })
    return selected
  }
  return []
}

const banner = ref()
const generationResponse: Ref<BannerGenerationResponse | undefined> = ref(undefined)
const generationBeingProcessed = ref(false)
const backgroundColor = ref(colorFromQuery ? colorFromQuery : "#FFFFEF")
const brandImage = ref(brandFromQuery ? brandFromQuery : undefined)
const logoSize = ref(logoSizeFromQuery ? logoSizeFromQuery : 'm')
const bannerSize = ref(bannerSizeFromQuery ? bannerSizeFromQuery : 'l')
const selection = ref(initSelection(skillsFromQuery))

const apiClient = useApiClient()

const generate = async () => {
  generationBeingProcessed.value = true
  generationResponse.value = await apiClient.generate(selection.value, brandImage.value, backgroundColor.value, logoSize.value, bannerSize.value)
  generationBeingProcessed.value = false
  setTimeout(() => banner.value.scrollIntoView({ behavior: "smooth" }), 150);
}
</script>
