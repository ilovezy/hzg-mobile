<template>
  <input type="checkbox" class="m-switch" v-model="checked"/>
</template>
<script type="text/babel">
  /**
   * 不兼容鸟包火狐
   */
  export default {
    name: 'iswitch',
    data() {
      return {
        checked: false
      }
    },
    props: {
      value: Boolean
    },
    watch: {
      checked(val) {
        this.$emit('input', val);
      }
    },
    mounted() {
      this.checked = this.value;
    }
  }
</script>
<style lang="less">
  @import '../../../assets/styles/components/switch.less';
</style>
