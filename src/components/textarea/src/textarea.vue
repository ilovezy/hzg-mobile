<template>
  <div class="m-textarea">
        <textarea v-model="mlstr" :placeholder="placeholder" :maxlength="maxlength" :readonly="readonly"></textarea>
    <div class="textarea-counter" v-if="showCounter && maxlength">{{num}}/{{maxlength}}</div>
  </div>
</template>

<script type="text/babel">
  export default {
    name: 'cf-textarea',
    data() {
      return {
        num: 0,
        mlstr: ''
      }
    },
    props: {
      maxlength: {
        validator(val) {
          if(!val) return true;
          return /^(([1-9]\d*)|0)$/.test(val);
        }
      },
      placeholder: {
        type: String
      },
      readonly: {
        type: Boolean,
        default: false
      },
      value: {
        type: String
      },
      showCounter: {
        type: Boolean,
        default: true
      },
      change: {
        type: Function
      }
    },
    watch: {
      mlstr(val) {
        this.$emit('input', val);
        typeof this.change == 'function' && this.change();
        if (this.showCounter) this.num = val.length;
      },
      value(val) {
        this.mlstr = val;
      }
    },
    mounted() {
      this.$nextTick(() => {
        const v = this.value;
        if (!v)return;
        this.mlstr = v.length > this.maxlength ? v.substr(v, this.maxlength) : v;
      });
    }
  }
</script>
<style lang="less">
  @import '../../../assets/styles/components/textarea.less';
</style>
