<template>
  <div id="app">
    <transition :name="pageDirection">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex';
  export default {
    name: 'app',
    computed: {
      ...mapState([
        'pageDirection'
      ])
    }
  }
</script>
