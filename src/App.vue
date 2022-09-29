<template>
  <v-app>
    <notifications position="bottom right"/>
    <v-card color="indigo" flat tile dark>
      <v-card color="indigo" flat tile dark max-width="1024px" class="mx-auto">
        <!-- Head banner -->
        <Header />

        <!-- Form -->
        <v-card-text class="mt-6">

          <!-- Description -->
          <BannerShakeDesc />

          <!-- Skills selector -->
          <v-row class="px-3 pt-2">
            <SkillSelector v-model="selected"></SkillSelector>
          </v-row>

          <!-- Filter row -->
          <v-row align="center" justify="center">

            <!-- Brand image -->
            <v-col :cols="$vuetify.breakpoint.xs ? 12 : 4" class="py-0">
              <BrandImageSelector v-model="brandImage"></BrandImageSelector>
            </v-col>

            <!-- Logos size selector -->
            <v-col :cols="$vuetify.breakpoint.xs ? 12 : 4">
              <LogoSizeSelector v-model="logoSize"></LogoSizeSelector>
            </v-col>

            <!-- Banner background color picker -->
            <v-col :cols="$vuetify.breakpoint.xs ? 12 : 4" :class="$vuetify.breakpoint.xs ? 'pb-0' : 'pb-5'">
              <ColorPicker v-model="backgroundColor"></ColorPicker>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Action row -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-col :cols="$vuetify.breakpoint.xs ? 12 : 4">
            <v-btn
                color="success"
                :disabled="selected.length === 0"
                @click="generate"
                :x-large="!$vuetify.breakpoint.xs"
                block
                :loading="generationBeingProcessed"
            >
              {{ $t('generate') }}
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-card>

    <!-- Skills banner display -->
    <v-card tile height="100%">
      <DisplayBanner
          ref="displayBanner"
          :skills="selected"
          :logo-size="logoSize"
          :brand-image="brandImage"
          :background-color="backgroundColor"
          @in-progress="generationBeingProcessed = $event"
      >
      </DisplayBanner>
    </v-card>

    <!-- Footer -->
    <Footer />
  </v-app>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DisplayBanner from "@/components/DisplayBanner";
import SkillSelector from "@/components/SkillSelector";
import ColorPicker from "@/components/ColorPicker";
import BrandImageSelector from "@/components/BrandImageSelector";
import LogoSizeSelector from "@/components/LogoSizeSelector";
import BannerShakeDesc from "@/components/BannerShakeDesc";
import { mapState } from "vuex";

export default {
  name: "App",
  metaInfo: {
    title: "BannerShake - Skills Banner Generator"
  },
  components: {
    BannerShakeDesc,
    LogoSizeSelector,
    BrandImageSelector,
    ColorPicker,
    SkillSelector,
    DisplayBanner,
    Footer,
    Header
  },
  data: () => ({
    selected: [],
    logoSize: 40 * 4,
    generationBeingProcessed: false,
    backgroundColor: "#FFFFEFFF",
    brandImage: null,
  }),
  created() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const skillsStr = params.skills
    if (skillsStr) {
      this.selected = skillsStr.split(',').map(s => this.skillsByShortname.get(s))
      console.log(this.selected)
    }
  },
  computed: {
    ...mapState({
      skillsByShortname: (state) => new Map(state.skills.map(s => [s.shortname, s]),)
    })
  },
  methods: {
    generate() {
      this.$refs.displayBanner.generate();
    }
  }
};
</script>
