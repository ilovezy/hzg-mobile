<template>
  <section class="flexview">
    <div class="appdown" v-if="appdown" style="z-index: 2000">
      <a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.cflc.hp">点击下载长富理财存管APP，玩转积分乐趣</a>
      <i class="icon-error-outline" @click="closeAppdown"></i>
    </div>
    <slot name="navbar" v-if="showNavbar">
      <navbar :title="title" v-if="!!title">
        <router-link :to="link || '/'" slot="left">
          <navbar-back-icon></navbar-back-icon>
        </router-link>
      </navbar>
    </slot>
    <slot name="top">
    </slot>
    <section class="scrollview" ref="scrollView">
      <slot></slot>
    </section>
    <slot name="bottom"></slot>
    <slot name="tabbar">
      <tabbar slot="tabbar" v-if="showTabbar" class="primary-nav">
        <tabbar-item title="首页" link="/" class="-home">
          <i class="icon-home" slot="icon"></i>
        </tabbar-item>
        <tabbar-item title="理财" link="/product" class="-product">
          <i class="icon-product" slot="icon"></i>
        </tabbar-item>
        <!--<tabbar-item title="积分" link="/integral">-->
          <!--<i class="icon-integral" slot="icon"></i>-->
        <!--</tabbar-item>-->
        <tabbar-item title="我的" link="/account">
          <i class="icon-account" slot="icon"></i>
        </tabbar-item>
      </tabbar>
    </slot>
  </section>
</template>
<script type="text/babel">
  export default {
    name: 'layout',
    data() {
      return {
        appdown: true,
        isLogin: Boolean
      }
    },
    props: {
      link: String,
      title: String,
      showNavbar: {
        type: Boolean,
        default: true
      },
      showTabbar: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.isAppdown()
    },
    methods: {
      isAppdown() {
        if (sessionStorage.getItem('appdown') === 'false') {
          this.appdown = false
        } else if( this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          this.appdown = false
        }
      },
      closeAppdown() {
        this.appdown = false
        sessionStorage.setItem("appdown", "false")
//        localStorage.setItem('appdown', 'false')
      }
    }
  }
</script>
<style lang="less">
  @import "../../../assets/styles/components/layout.less";
</style>
