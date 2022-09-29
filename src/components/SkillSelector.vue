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
        <img :src="require('../static/' + data.item.icon)" width="24" alt=""/>
        <span class="ml-4 font-weight-light">{{ data.item.name }}</span>
      </v-row>
    </template>
    <template v-slot:selection="data">
      <draggable
          :id="data.index"
          :list="selected"
          v-bind="dragOptions"
          :move="move"
          @change="change"
      >
        <v-chip
            draggable
            v-model="selected[data.index]"
            :key="data.item.value"
            @mousedown.stop
            @click.stop
            class="mb-1" color="white" text-color="indigo" close @click:close="onSkillRemoved(data)"
        >
          {{ data.item.name }}
        </v-chip>
      </draggable>
    </template>
  </v-autocomplete>
</template>
<script>

import draggable from "vuedraggable";
import { mapState } from "vuex";

export default {
  components: {draggable},
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    search: null,
    selected: [],
    reorder: false,
    drag: false
  }),
  created() {
    this.selected = this.value;
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: {name: "group", pull: true, put: true},
        sort: true,
      };
    },
    ...mapState({
      skills: (state) => state.skills
    })
  },
  watch: {
    selected() {
      this.search = null;
    }
  },
  methods: {
    onSkillRemoved(data) {
      data.parent.selectItem(data.item);
    },
    move(value) {
      this.dragged = {
        from: parseInt(value.from.id),
        to: parseInt(value.to.id),
        newIndex: value.draggedContext.futureIndex,
      }
    },
    change(value) {
      if (value.removed) {
        // insert
        this.selected.splice(this.dragged.to + this.dragged.newIndex, 0, this.selected[this.dragged.from])
        // delete
        if (this.dragged.from < this.dragged.to) // LTR
          this.selected.splice(this.dragged.from, 1)
        else // RTL
          this.selected.splice(this.dragged.from + 1, 1)
      }
    }
  }
}
</script>
