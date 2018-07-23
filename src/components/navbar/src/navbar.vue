<template>
  <header class="navbar navbar-bottom-line-color" :class="classes" :style="{backgroundColor: bgcolor, height: height}">
    <div class="navbar-item">
      <slot name="left"></slot>
    </div>
    <div class="navbar-center" :style="{height: height,color: color, fontSize: fontsize}">
      <slot name="center" class="center-title">{{title}}</slot>
    </div>
    <div class="navbar-item">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script type="text/babel">
  import {isColor} from '../../utils/assist';
  export default {
    name: 'navbar',
    props: {
      title: String,
      fixed: Boolean,
      bgcolor: {
        validator(value) {
          if(!value) return true;
          return isColor(value);
        },
        default: '#FFF'
      },
      color: {
        validator(value) {
          if(!value) return true;
          return isColor(value);
        },
        default: '#5C5C5C'
      },
      fontsize: {
        validator(value) {
          return /^(\.|\d+\.)?\d+(px|rem)$/.test(value);
        },
        default: '.36rem'
      },
      height: {
        validator(value) {
          return /^(\.|\d+\.)?\d+(px|rem)$/.test(value);
        },
        default: '.9rem'
      }
    },
    computed: {
      classes() {
        return this.fixed ? 'navbar-fixed' : '';
      }
    }
  }
</script>
<style lang="less">
  @import '../../../assets/styles/components/navbar.less';
</style>
