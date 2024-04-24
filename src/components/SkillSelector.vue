<template>
  <v-text-field id="skills-container" readonly variant="outlined" :label="t('skills')"
                persistent-placeholder
                :append-inner-icon="model && model?.length > 0 ? 'mdi-close' : undefined"
                @click:append-inner="clearSelection()" >
    <template v-slot:append>
      <v-btn variant="outlined" size="x-large" @click="open = true">{{ t('add') }}</v-btn>
    </template>
    <template v-slot:default>
      <span v-if="model?.length === 0" class="text-grey-darken-2">{{  t('selectSkills') }}</span>
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
  <v-dialog v-model="open" scrollable max-width="800px" :fullscreen="mobile" persistent>
    <v-card max-height="700px">
      <div class="d-flex flex-row ma-4">
        <span class="text-h6">{{ t('skills') }}</span>
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </div>
      <v-divider></v-divider>
      <v-text-field variant="outlined" v-model="search" :label="t('filter')" :placeholder="t('searchSkills')" class="mx-4 mt-4"/>
      <v-card-text>
        <v-infinite-scroll @load="load">
          <v-row>
            <v-col v-for="(_, i) in pagedSkills" :key="i" :cols="mobile ? 12 : 6">
              <SkillItem v-model="pagedSkills[i]" @selected="handleSelect(pagedSkills[i])"/>
            </v-col>
          </v-row>
        </v-infinite-scroll>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" variant="text" size="x-large" @click="closeDialog">{{ t('done') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, Ref, ref, watch} from "vue";
import {useDisplay} from "vuetify";
import {useI18n} from "vue-i18n";
import SkillItem from "./SkillItem.vue";
import draggable from 'vuedraggable'

const model = defineModel<Skill[]>()
const props = defineProps<{
  skills: Skill[]
}>()
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

const closeDialog = () => {
  open.value = false
  reset()
}

const handleSelect = (selected: Skill) => {
  if (selected.selected) {
    model.value?.push(selected)
  } else {
    removeFromSelection(selected)
  }
}

const removeFromSelection = (skill: Skill) => {
  skill.selected = false
  model.value = model.value?.filter(s => s.shortname !== skill.shortname)
}

const clearSelection = () => {
  model.value?.forEach(skill => skill.selected = false)
  model.value = []
}

const visibleSkills = computed(() => props.skills?.filter(s => s.shortname.includes(search.value) || s.name.includes(search.value)))

const nextPage = () => {
  const subSkills: Skill[] = []
  if (visibleSkills.value && visibleSkills.value.length > currentPage.value * pageSize) {
    if (visibleSkills.value.length < currentPage.value * pageSize + pageSize) {
      subSkills.push(...visibleSkills.value.slice(currentPage.value * pageSize))
    } else {
      subSkills.push(...visibleSkills.value.slice(currentPage.value * pageSize, currentPage.value * pageSize + pageSize))
    }
  }
  currentPage.value = currentPage.value + 1
  return subSkills;
}

const currentPage = ref(0)
const pageSize = 20

const pagedSkills: Ref<Skill[]> = ref([])
pagedSkills.value.push(...nextPage())

const load = ({done}: {done: (status: 'loading' | 'error' | 'empty' | 'ok') => void}) => {
  let skills = nextPage();
  if (skills.length === 0) {
    done('empty')
  } else {
    pagedSkills.value.push(...skills)
    done('ok')
  }
}

const reset = () => {
  currentPage.value = 0
  pagedSkills.value = nextPage()
}

watch(search, () => reset())

</script>
<style>
#skills-container {
  display: none !important;
}
</style>
