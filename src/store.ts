import { defineStore } from 'pinia'
import _ from "lodash";

import managedLogosData from "./static/managed/managedLogos.json" with { type: "json" } ;
import providedLogosData from "./static/provided/providedLogos.json" with { type: "json" };

const managedLogos: Skill[] = managedLogosData as Skill[];
const providedLogos: Skill[] = providedLogosData as Skill[];

const merged: Skill[] = _.sortBy(_.unionBy(managedLogos, providedLogos, 'shortname'), 'shortname')

interface SkillsStoreState {
    data: Skill[]
}

export const useSkillsStore = defineStore('skills', {
    state: (): SkillsStoreState => ({
        data: merged
    }),
    getters: {
        count: (state) => state.data.length,
        skills: (state) => state.data
    }
})