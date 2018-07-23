<template>
  <layout>
    <div class="tab header-tab">
      <div class="tab-head">
      <i class="back-icon" @click="goBack()"></i>
      <ul class="tab-nav">
        <li class="tab-nav-item tab-active">
          <router-link to="/product/collection_end">已成立</router-link>
        </li>
        <li class="tab-nav-item">
          <router-link to="/product/payed">已完结</router-link>
        </li>
      </ul>
      </div>
      <div class="tab-panel">
        <div class="notavailable" v-show="this.list.length == 0"><img src="../../../static/images/notavailable/not_product_log.png" alt="暂无已成立项目~" class="not_icon"><p class="not_txt">暂无已成立项目~</p></div>
        <infinitescroll :on-infinite="loadCollectionEndList" ref="loadCollectionEndList" v-show="this.list.length !== 0">
          <div class="product-list" slot="list" style="padding-bottom: .2rem">
            <router-link tag="div" :to="{ name: 'product_detail',params: { productId: item.id }}" class="product-item collection-end" v-for="item in list" :key="item.id">
              <h3><span>{{item.name}}</span><i v-if="item.novice == true" class="novice">新手专享</i></h3>
              <div class="product-props">
                <dl>
                  <dd>
                    <span>{{item.formatScale2ExpectAnnualizedRate}}</span><span v-if="item.extraAnnualizedRate > 0"><em>+</em>{{item.formatScale2ExtraAnnualizedRate}}</span><em>%</em>
                  </dd>
                  <dt>预期年化</dt>
                </dl>
                <dl>
                  <dd>
                    {{item.period}}{{item.formatPeriodType}}
                  </dd>
                  <dt>项目期限</dt>
                </dl>
                <dl>
                  <dd>{{item.formatTotalAmount}}万元</dd>
                  <dt>项目总额</dt>
                </dl>
              </div>
            </router-link>
          </div>
        </infinitescroll>
      </div>
    </div>
  </layout>
</template>
<script>
  export default {
    data () {
      return {
        list: '',
        page: 0,
        size: 10
      }
    },
    created() {
      this.loadCollectionEndList()
    },
    methods: {
      goBack(){
        this.$router.push({path:'/product'})
      },
      // 滚动加载已成立分页数据
      loadCollectionEndList() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('security/icProject/list?status=collection_end&status=loan_finished&page=' + this.page + '&size=' + this.size).then(res => {
          var _list = res.result.content
          if(_list === undefined){
            _list = null
          }
          this.list = [...this.list, ...(_list || [])];
          if (_list === null || _list.length < this.size || this.page === 10) {
            // 所有数据加载完毕
            this.$refs.loadCollectionEndList.$emit('cf.infinitescroll.loadedDone');
            return;
          }
          // 单次请求数据完毕
          this.$refs.loadCollectionEndList.$emit('cf.infinitescroll.finishLoad');
          this.page++;
        });
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/product.styl"
</style>
