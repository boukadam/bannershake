<template>
  <v-footer padless>
    <v-container class="d-flex justify-space-between align-center" style="max-width: 1024px">
      <div>
        <a class="github-button" href="https://github.com/boukadam/bannershake" data-size="large" data-show-count="true"
           aria-label="Star boukadam/skills-banner-generator on GitHub"> Star </a>
      </div>
      <div v-if="!$vuetify.breakpoint.xs" class="mx-12">
        <v-row align="center">{{ new Date().getFullYear() }} -
          <v-img :src="require('../assets/logo-black.png')" max-width="24" class="mx-1"/>
          BannerShake
        </v-row>
      </div>
      <div>
        <a class="github-button" href="https://github.com/boukadam" data-size="large" aria-label="Follow @boukadam on GitHub">
          Follow @boukadam
        </a>
      </div>
    </v-container>
  </v-footer>
</template>