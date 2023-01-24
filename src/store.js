import Vue from "vue";
import _ from 'lodash'

import Vuex from "vuex";
import managedLogos from "@/static/managed/managedLogos.json";
import providedLogos from "@/static/provided/providedLogos.json";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        skills: _.sortBy(_.unionBy(managedLogos, providedLogos, 'shortname'), 'shortname')
    }
})