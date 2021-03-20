<template>
  <v-autocomplete
      v-model="selected"
      :items="skills"
      :search-input.sync="search"
      :label="$t('selectSkills')"
      dense
      multiple
      clearable
      chips
      hide-selected
      return-object
      item-text="name"
      @input="$emit('input', $event)"
  >
    <template v-slot:item="data">
      <v-row class="ml-2" align="center">
        <img :src="require('../static/' + data.item.icon)" width="24" alt="" />
        <span class="ml-4 font-weight-light">{{ data.item.name }}</span>
      </v-row>
    </template>
    <template v-slot:selection="data">
      <v-chip class="mb-1" color="white" text-color="indigo" close @click:close="onSkillRemoved(data)">
        <span>{{ data.item.name }}</span>
      </v-chip>
    </template>
  </v-autocomplete>
</template>
<script>

import json from "@/static/provided/providedLogos.json";

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    search: null,
    skills: json,
    selected: []
  }),
  created() {
    this.selected = this.value;
  },
  watch: {
    selected() {
      this.search = null;
    }
  },
  methods: {
    onSkillRemoved(data) {
      data.parent.selectItem(data.item);
    }
  }
}
</script>
