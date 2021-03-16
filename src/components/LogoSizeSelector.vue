<template>
  <v-select
      v-model="logoSize"
      :items="logoSizes"
      :label="$t('logoSize')"
      item-text="title"
      item-value="size"
      @change="$emit('input', $event)"
  ></v-select>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      default: () => 40 * 4
    }
  },
  data: () => ({
    logoSize: null
  }),
  created() {
    this.logoSize = this.value
  },
  computed: {
    logoSizes() {
      return [
        {
          title: this.$t('smallLogoSize'),
          size: 25 * 4,
        },
        {
          title: this.$t('mediumLogoSize'),
          size: 40 * 4,
        },
        {
          title: this.$t('largeLogoSize'),
          size: 55 * 4,
        },
      ]
    }
  }
}
</script>
