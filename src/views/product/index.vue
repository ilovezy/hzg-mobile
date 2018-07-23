<template>
  <layout :showTabbar="true">
    <navbar slot="navbar" :title="$route.meta.title"></navbar>
    <infinitescroll :on-infinite="loadProductList" ref="loadProductList" v-show="list.length !== 0" class="product-infinitescroll">
      <div class="product-list" slot="list">
        <router-link tag="div" :to="{ name: 'product_detail',params: { productId: item.id }}" class="product-item" v-for="item in list" :key="item.id">
          <h3><span>{{item.name}}</span><i v-if="item.novice == true" class="novice">新手专享</i></h3>
          <div class="product-props">
            <dl>
              <dd>
                <span>{{item.formatScale2ExpectAnnualizedRate}}</span><em>%</em><span v-if="item.extraAnnualizedRate > 0"><em>+</em>{{item.formatScale2ExtraAnnualizedRate}}<em>%</em></span>
              </dd>
              <dt>预期年化</dt>
            </dl>
            <dl>
              <dd>
                {{item.period}}{{item.formatPeriodType}}
              </dd>
              <dt>项目期限</dt>
            </dl>
            <dl v-if="item.showTime">
              <dd style="line-height: .5rem">
                <countdown :time="item.startTimeCountDown" timetype="second" doneText="已开始募集" :callback="function(){item.showTime = false}" class="countdown">
                  <i>{%h}</i>: <i>{%m}</i>: <i>{%s}</i>
                </countdown>
              </dd>
              <dt>距离募集开始</dt>
            </dl>
            <dl v-else>
              <dd>{{item.formatTotalAmount}}万元</dd>
              <dt>项目总额</dt>
            </dl>
          </div>
          <div class="progress">
            <div class="progressbar"><i :style="{width: item.investAmount * 100 / item.totalAmount + '%'}"></i></div>
            <span>{{(item.investAmount * 100 / item.totalAmount).toFixed(2)}}%</span>
          </div>
        </router-link>
      </div>
      <!--<router-link to="/product/collection_end" tag="div" class="btn-product-more" slot="doneTip">-->
      <!--<icon name="shield" size=".28rem" color="#d82d2d"></icon>-->
      <!--已成立项目{{collectionEndProjectCount}}个，已完结项目{{payedProjectCount}}个，<span>点击查看-->
      <!--<icon name="arrow-right" size=".22rem"></icon></span>-->
      <!--</router-link>-->
    </infinitescroll>
    <div class="list-donetip" :style="list.length !== 0 ? 'display: block; padding-top: 0' : 'display: block;'">
      <router-link to="/product/collection_end" tag="div" class="btn-product-more ">
        <icon name="shield" size=".28rem" color="#d82d2d"></icon>
        已成立项目{{collectionEndProjectCount}}个，已完结项目{{payedProjectCount}}个，<span>点击查看
        <icon name="arrow-right" size=".22rem"></icon></span>
      </router-link>
    </div>
    <div class="notavailable" v-show=" list.length == 0">
      <img src="../../../static/images/notavailable/not_product.png" alt="暂无理财项目~" class="not_icon">
      <p class="not_txt">暂无理财项目~</p></div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        list: '',
        page: 0,
        pageSize: 10,
        projectCount: 0,
        collectionEndProjectCount: 0,
        payedProjectCount: 0
      }
    },
    created() {
      this.loadProductList()
    },
    methods: {
      // 滚动加载数据
      loadProductList() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('security/icProject/index?page=' + this.page + '&size=' + this.pageSize).then(res => {
          this.collectionEndProjectCount = res.result.collectionEndProjectCount
          this.payedProjectCount = res.result.payedProjectCount
          this.projectCount = this.collectionEndProjectCount + this.payedProjectCount
          var _list = res.result.pageIcProjectPojo.content
          if (_list !== undefined) {
            for (var i = 0; i < _list.length; i++) {
              if (_list[i].startTimeCountDown === undefined || _list[i].startTimeCountDown <= 0) {
                _list[i].showTime = false;
              } else {
                _list[i].showTime = true;
              }
            }
          } else {
            _list = null
          }
          this.list = [...this.list, ...(_list || [])];
          if (_list === null || _list.length < this.pageSize || this.page === 10) {
            // 所有数据加载完毕
            this.$refs.loadProductList.$emit('cf.infinitescroll.loadedDone');
            return;
          }
          // 单次请求数据完毕
          this.$refs.loadProductList.$emit('cf.infinitescroll.finishLoad');
          this.page++;
        });
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/product.styl"
</style>
