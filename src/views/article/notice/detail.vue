<template>
  <layout>
  <div class="article-detail -notice" :class="isOs ? '-isOs' : ''">
    <header class="article-header">
      <h1>{{noticedetail.title}}</h1>
      <span>{{noticedetail.createAt}}</span>
      <div class="article-close" @click="goBack"><i class="icon-close"></i></div>
    </header>
    <article class="article-content" v-html="noticedetail.content" @click="imageZoom"></article>
    <popup v-model="imageZoomPopup" position="center" width="95%" class="big-img">
      <img :src="bigSrc" ref="imgPinch" v-finger:pinch="onPinch" v-finger:press-move="pressMove" v-on:multipoint-start="onMultipointStart">
    </popup>
  </div>
  </layout>
</template>
<script>
  import Vue from 'vue'
  import AlloyFinger from 'alloyfinger'
  import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue'
  import Transform from 'css3transform'
  Vue.use(AlloyFingerVue, {AlloyFinger: AlloyFinger});
  export default {
    data () {
      return {
        noticedetail: '',
        isOs: false,
        imageZoomPopup: false,
        bigSrc: '',
        initScale: 1
      }
    },
    created(){
      this.isOsAccess()
      this.noticeDetail()
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      isOsAccess(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          this.isOs = true //true 为不显示顶部标题
        }
      },
      noticeDetail(){
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('security/notice/view/' + this.$route.params.noticeId).then(res => {
          if (res.success) {
            this.noticedetail = res.result
          } else if (res.error = 'PROJECT_NOT_EXIST_ERROR') {
            this.$dialog.confirm({
              mes: res.errorDescription,
              opts: [{
                txt: '返回',
                color: true,
                callback: () => {
                  this.$router.back()
                }
              }]
            });
          }
        })
      },
      imageZoom(i){
        this.bigSrc = i.target.src
        if (this.bigSrc !== undefined) {
          if (this.isOs) {
            window.location.href = 'cflc://jsbridge?name=src&type=' + this.bigSrc
          } else {
            this.imageZoomPopup = true
          }
        }
      },
      onMultipointStart: function () {
        this.initScale = this.$refs.imgPinch.scaleX;
      },
      onPinch: function (evt) {
        this.$refs.imgPinch.scaleX = this.$refs.imgPinch.scaleY = this.initScale * evt.scale;
      },
      pressMove: function (evt) {
        this.$refs.imgPinch.translateX += evt.deltaX;
        this.$refs.imgPinch.translateY += evt.deltaY;
      }
    },
    mounted: function () {
      Transform(this.$refs.imgPinch)
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/article.styl"
  .article-detail
    &.-notice
      padding 0
      background-color #fff
      display flex
      flex-direction: column;
      height: 100%
      & .article-header
        position: relative
        padding-top .8rem
        margin 0 .3rem
        & .article-close
          position: absolute
          top .3rem
          left 0
          & i:before
            font-size .36rem
            color #666
      & .article-content
        padding .3rem
        overflow-y auto
        -webkit-overflow-scrolling: touch;
        width 100%
        height: 100%
        flex 1
    &.-isOs
      & .article-header
        padding-top .3rem
        .article-close
          display none
  .big-img
    .popup-mask
      background-color rgba(0, 0, 0, .5)
    & .popup-center
      text-align: center;
      background-color transparent
      & img
        max-width 100%
        margin 0 auto
        -webkit-overflow-scrolling: touch;
</style>
