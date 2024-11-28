<template>
  <v-text-field id="skills-container" readonly variant="outlined" :label="t('skills')"
                persistent-placeholder hide-details class="mb-2"
                :append-inner-icon="model && model?.length > 0 ? 'mdi-close' : undefined"
                @click:append-inner="clearSelection()">
    <template v-if="!mobile" v-slot:append>
      <v-btn variant="outlined" size="x-large" @click="open = true">{{ t('select') }}</v-btn>
    </template>
    <template v-slot:default>
      <span v-if="model?.length === 0" class="text-grey-darken-2">{{ t('selectSkills') }}</span>
      <draggable item-key="shortname" v-model="model" @start="dragging = true" @end="dragging = false" v-bind="dragOptions">
        <template #item="{ element }">
          <v-chip class="mr-2 my-1 py-4 text-subtitle-2" draggable @mousedown.stop
                  @click.stop color="grey-lighten-5" border
                  :key="element.shortname" closable variant="flat"
                  @click:close="removeFromSelection(element)"
          >
            {{ element.name }}
          </v-chip>
        </template>
      </draggable>
    </template>
  </v-text-field>
  <v-btn v-if="mobile" block variant="outlined" size="x-large" class="mb-4" @click="open = true">{{ t('select') }}</v-btn>

  <v-dialog v-model="open" scrollable max-width="800px" :fullscreen="mobile" persistent>
    <v-card max-height="700px">
      <div class="d-flex flex-row ma-4">
        <span class="text-h6">{{ t('skills') }}</span>
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </div>
      <v-divider></v-divider>
      <input v-model="search" type="text" class="mx-6 mt-4 border pa-3 rounded" :placeholder="t('searchSkills')" >
      <v-card-text>
        <v-infinite-scroll @load="load">
          <v-row>
            <v-col v-for="(_, i) in pagedSkills" :key="i" :cols="mobile ? 12 : 6">
              <SkillItem v-model="pagedSkills[i]" :selected="isSelected(pagedSkills[i])"  @selected="handleSelect(pagedSkills[i])"/>
            </v-col>
          </v-row>
        </v-infinite-scroll>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-4" class="mr-2" variant="text" size="x-large" @click="closeDialog">{{ t('add') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {reactive, Ref, ref, watch} from "vue";
import {useDisplay} from "vuetify";
import {useI18n} from "vue-i18n";
import SkillItem from "./SkillItem.vue";
import draggable from 'vuedraggable'
import {useApiClient} from "../composables/apiClient.ts";

const model = defineModel<Skill[]>({
  default: () => reactive([])
})
const open = ref(false)
const search = ref("")
const dragging = ref(false)
const dragOptions = {
  animation: 0,
  group: "people",
  disabled: false,
  ghostClass: "ghost"
}

const {mobile} = useDisplay()
const {t} = useI18n()
const apiClient = useApiClient()

const closeDialog = () => {
  open.value = false
  reset()
  clearFilter()
}

const clearFilter = () => {
  search.value = ""
}

const isSelected = (skill: Skill): boolean => {
  return model.value.includes(skill)
}

const handleSelect = (selected: Skill) => {
  if (selected.selected) {
    model.value.push(selected)
  } else {
    removeFromSelection(selected)
  }
}

const removeFromSelection = (skill: Skill) => {
  skill.selected = false
  model.value = model.value.filter(s => s.shortname !== skill.shortname)
}

const clearSelection = () => {
  model.value?.forEach(skill => skill.selected = false)
  model.value = []
}

const nextPage = () => {
  apiClient.search(search.value, currentPage.value + 1, pageSize)
      .then(response => {
        currentPage.value = currentPage.value + 1
        updatePagedSkills(response.data)
      })
}

const updatePagedSkills = (skills: Skill[]) => {
  pagedSkills.value.push(...skills)
  pagedSkills.value.filter(skill => model.value.filter(s => s.shortname === skill.shortname).length > 0)
      .forEach(skill => {
        skill.selected = true
      })
}

const currentPage = ref(0)
const pageSize = 20

const pagedSkills: Ref<Skill[]> = ref([])
nextPage()

const load = ({done}: { done: (status: 'loading' | 'error' | 'empty' | 'ok') => void }) => {
  apiClient.search(search.value, currentPage.value + 1, pageSize)
      .then(response => {
        currentPage.value = currentPage.value + 1
        if (response.data.length === 0) {
          done('empty')
        } else {
          updatePagedSkills(response.data)
          done('ok')
        }
      })
}

const reset = () => {
  currentPage.value = 0
  pagedSkills.value = []
  nextPage()
}

watch(search, () => reset())

</script>
<style>
#skills-container {
  display: none !important;
}
</style>
