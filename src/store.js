import Vue from "vue";

import Vuex from "vuex";
import json from "@/static/provided/providedLogos.json";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        skills: json
    }
})