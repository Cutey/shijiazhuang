import variables from '@/assets/styles/element-variables.scss'
//import variables from "@/assets/styles/variables.scss";
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, searchshow } = defaultSettings

const state = {
    theme: '#304156', //主题
    logoBoxColor: '#304156', //logoboxColor
    logoTextColor: '#fff', //logoTextColor
    showSettings: showSettings,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo,
    searchshow: searchshow,
}

const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    },

}
const actions = {
    changeSetting({ commit }, data) {
        commit('CHANGE_SETTING', data)
    }

}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}