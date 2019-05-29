
import Vue from 'vue';
import Vuex from 'vuex';
import FirstData from './modules/FirstData';

Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
    FirstData
  }
});
