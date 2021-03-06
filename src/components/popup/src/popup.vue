<template>
  <div>
    <div class="popup-mask" v-show="show" @click.stop="close"></div>
    <div :class="classes()" :style="styles()">
      <slot></slot>
    </div>
  </div>
</template>
<script type="text/babel">
  import {addClass, removeClass, getScrollview, pageScroll} from '../../utils/assist';
  export default {
    name: 'popup',
    data() {
      return {
        show: this.value
      }
    },
    props: {
      position: {
        validator(value) {
          return ['bottom', 'center', 'left', 'right', 'top'].indexOf(value) > -1;
        },
        default: 'bottom'
      },
      height: {
        type: String,
        default: '50%'
      },
      width: {
        type: String,
        default: '50%'
      },
      value: {
        type: Boolean
      }
    },
    watch: {
      value(val) {
        if (this.isIOS) {
          if (val) {
            pageScroll.lock();
            addClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');
          } else {
            pageScroll.unlock();
            removeClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');
          }
        }
        this.show = val;
      }
    },
    methods: {
      styles() {
        if (this.position == 'left' || this.position == 'right') {
          return {width: this.width};
        } else if (this.position == 'bottom') {
          return {width: '100%', height: this.height};
        } else if (this.position == 'top') {
          return {width: '100%', height: this.height};
        } else {
          return {width: this.width};
        }
      },
      classes() {
        return (this.position == 'center' ? 'popup-center ' : 'popup ') +
          (this.show ? 'popup-show ' : '') +
          'popup-' + this.position;
      },
      close() {
        this.isIOS && removeClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');
        this.show = false;
        this.$emit('input', false);
      }
    },
    mounted() {
      this.scrollView = getScrollview(this.$el);
      this.isIOS = !!(window.navigator && window.navigator.userAgent || '').match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    }
  }
</script>
<style lang="less">
  @import '../../../assets/styles/components/popup.less';
</style>
