<template>
  <span><i class="back-icon" :style="{color: color}"></i><slot></slot></span>
</template>

<script type="text/babel">
  import {isColor} from '../../utils/assist';
  export default {
    name: 'navbar-back-icon',
    props: {
      color: {
        validator(value) {
          if(!value) return true;
          return isColor(value);
        },
        default: '#5C5C5C'
      }
    }
  }
</script>
