<template>
  <v-row align="center">
    <span :class="$vuetify.breakpoint.xs ? mobileStyle : defaultStyle">
      <span v-html="$t('bannerShakeDesc')"></span>
    </span>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    defaultStyle: "py-4 ml-2 mb-4 font-weight-light text-justify text-md-h5 text-h6",
    mobileStyle: "ml-2 mb-2 font-weight-light text-justify text-md-h5 text-h6"
  })
}
</script>
