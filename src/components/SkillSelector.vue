<template>
  <v-autocomplete
      v-model="selected"
      :items="skills"
      :search-input.sync="search"
      :label="$t('selectSkills')"
      multiple
      clearable
      chips
      hide-selected
      item-value="icon"
      item-text="name"
      @input="$emit('input', $event)"
  >
    <template v-slot:item="data">
      <v-row class="ml-2" align="center">
        <img :src="require('../static/' + data.item.icon)" width="24"/>
        <span class="pl-2">{{ data.item.name }}</span>
      </v-row>
    </template>
    <template v-slot:selection="data">
      <v-chip close @click:close="onSkillRemoved(data)">
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
  methods: {
    onSkillRemoved(data) {
      data.parent.selectItem(data.item);
    }
  }
}
</script>
