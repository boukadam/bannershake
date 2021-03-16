<template>
  <v-text-field v-model="backgroundColor" :label="$t('backgroundColor')" hide-details readonly class="ma-0 pa-0">
  <template v-slot:append>
    <v-menu v-model="colorPickerMenu" top nudge-bottom="105" nudge-left="16" :close-on-content-click="true">
      <template v-slot:activator="{ on }">
        <div :style="swatchStyle" v-on="on"/>
      </template>
      <v-card>
        <v-card-text class="pa-0">
          <v-color-picker v-model="backgroundColor" show-swatches flat light @input="$emit('input', backgroundColor)"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text large @click="selectColor">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </template>
  </v-text-field>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: () => "#FFFFEFFF"
    }
  },
  data: () => ({
    backgroundColor: null,
    colorPickerMenu: false,
  }),
  created() {
    this.backgroundColor = this.value
  },
  computed: {
    swatchStyle() {
      const {backgroundColor, colorPickerMenu} = this
      return {
        backgroundColor: backgroundColor,
        cursor: 'pointer',
        height: '30px',
        width: '60px',
        borderRadius: colorPickerMenu ? '50%' : '4px',
        border: 'solid',
        borderWidth: 'thin',
        transition: 'border-radius 200ms ease-in-out',
        marginBottom: '4px'
      }
    }
  },
  methods: {
    selectColor() {
      this.colorPickerMenu = false;
      this.$emit('input', this.backgroundColor);
    }
  }
}
</script>
