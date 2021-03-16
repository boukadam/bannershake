<template>
  <v-file-input
      accept="image/*"
      :label="$t('brandImage')"
      chips
      @change="change"
      @click:clear="reset"
  ></v-file-input>
</template>
<script>
export default {
  methods: {
    change(file) {
      let reader = new FileReader();
      let _this = this;
      reader.addEventListener("load", function () {
        _this.$emit("input", reader.result);
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    reset() {
      this.$emit("input", null);
    }
  }
}
</script>
