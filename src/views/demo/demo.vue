<template>
  <layout :showTabbar="true" :title="title">
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
        title: 'jackson'
      }
    },
    created(){
      this.setTitle(this.$route.params.title)
      this.getHome()
    },
    methods: {
      setTitle(str){
        this.title = str
      },
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
