<template>
  <v-footer app color="grey-lighten-2">
    <v-container class="d-flex justify-space-between align-center" style="max-width: 1024px">
      <github-button
          href="https://github.com/boukadam/bannershake"
          data-size="large"
          data-show-count="true"
          data-text="BannerShake"
          data-icon="octicon-star"
          aria-label="Star boukadam/bannershake on GitHub"
      />
      <div v-if="!mobile" class="mx-12">
        <v-row align="center" class="font-weight-medium">{{ new Date().getFullYear() }} -
          <v-img :src="logoBlack" max-width="24" class="mx-1"/>
          BannerShake
        </v-row>
      </div>
      <github-button
          href="https://github.com/boukadam"
          data-size="large"
          data-text="Follow @boukadam"
      />
    </v-container>
  </v-footer>
</template>
<script setup lang="ts">
import logoBlack from '../static/logo-black.png'
import {useDisplay} from "vuetify";
import GithubButton from 'vue-github-button'

const {mobile} = useDisplay()
</script>