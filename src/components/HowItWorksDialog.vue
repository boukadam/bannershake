<template>
  <v-dialog v-model="open" scrollable max-width="800px" :fullscreen="$vuetify.breakpoint.xs">
    <v-card max-height="700px">
      <v-card-title>
        <span>{{ $t('howItWorks.title') }}</span>
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="my-4 font-weight-light title text-justify">
        <p>
          {{ $t('howItWorks.step1') }}
        </p>
        <p>
          {{ $t('howItWorks.step2') }}
        </p>
        <p>
          {{ $t('howItWorks.step3') }}
        </p>
        <p>
          {{ $t('howItWorks.example1') }}
        </p>
        <p>
          <v-img :src="require('../static/examples/wafood-skills-banner.png')"/>
        </p>
        <p>
          {{ $t('howItWorks.example2') }}
        </p>
        <v-img :src="require('../static/examples/boukadam-banner.png')"/>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" text x-large @click="closeDialog">{{ $t('howItWorks.gotIt') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    open: false
  }),
  watch: {
    value(newVal) {
      this.open = newVal
    }
  },
  methods: {
    closeDialog() {
      this.open = false;
      this.$emit('input', this.open);
    }
  }
}
</script>