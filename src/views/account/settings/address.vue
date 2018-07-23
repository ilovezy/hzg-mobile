<template>
  <layout>
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
      <ibutton slot="right" mini  type="primary" action-type="button">保存</ibutton>
    </navbar>
    <div class="">
      <cell-group title="收货地址">
        <cell-item>
          <input slot="right" type="text" @click.stop="citySelectShow = true" v-model="citySelect" readonly class="cell-input" placeholder="请选择收货地区">
        </cell-item>
        <cell-item>
          <input slot="right" type="text" class="cell-input" placeholder="详细地址">
        </cell-item>
      </cell-group>
      <cityselect v-model="citySelectShow" :done="citySelectResult"></cityselect>
    </div>
  </layout>
</template>
<script>
  export default {
    data () {
      return {
        citySelect: '请选择',
        citySelectShow: false
      }
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      citySelectResult(ret) {
        this.citySelect = ret.provance + ' ' + ret.city + ' ' + ret.area;
      }
    },
    components: {}
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
