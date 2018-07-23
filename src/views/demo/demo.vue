<template>
  <layout :showTabbar="true" title="jackson">
    <h1>test page</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae deleniti ducimus eius error illum iste itaque laudantium numquam repellat repellendus!
    </p>
  </layout>
</template>
<script>
  export default {
    data () {
      return {

      }
    },
    created(){
      this.getHome()
    },
    methods: {
      getHome(){

      },
      openDetail(){
      },
      refreshPage(){
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
