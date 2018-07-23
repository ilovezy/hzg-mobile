/**
 * Created by ymjdev on 2017/3/22.
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 1,
    pageDirection: 'fade',
    routeChain:[]
  },
  mutations: {
    addRouteChain(state, route){
      state.routeChain.push(route);
    },
    popRouteChain(state){
      state.routeChain.pop();
    },
    setPageDirection(state, dir){
      state.pageDirection = dir;
    }
  }
});
