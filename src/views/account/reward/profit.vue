<template>
  <layout>
    <div class="tab header-tab">
      <div class="tab-head">
      <i class="back-icon" @click="goBack()"></i>
      <ul class="tab-nav">
        <li class="tab-nav-item">
          <router-link to="./cash_reward">红包</router-link>
        </li>
        <li class="tab-nav-item  tab-active">
          <router-link to="./profit_reward">加息券</router-link>
        </li>
      </ul>
      </div>
      <div class="tab-panel">
        <div class="notavailable" v-show="this.profitList.length == 0"><img
          src="../../../../static/images/notavailable/not_profit.png" alt="暂无加息券~" class="not_icon">
          <p class="not_txt">暂无加息券~</p></div>
        <infinitescroll :on-infinite="loadProfitList" ref="loadProfitList" v-show="this.profitList.length !== 0">
          <div slot="list" class="reward-list">
            <div class="reward-item -coupon" v-for="item in profitList"
                 :class="[item.status == 'processing' ? '-processing': '',item.status == 'used' ? '-used': '',item.status == 'overdue' ? '-overdue': '']">
              <h3>{{item.couponName}}</h3>
              <div class="reward-number">{{item.amount}}<span>%</span></div>
              <ul class="reward-condition" v-if="item.status == 'used' || item.status == 'processing'">
                <li>使用项目：{{item.profitProjectName}}</li>
                <li>使用时间：{{item.formatUsedTime}}</li>
                <li>编号：{{item.couponCode}}</li>
              </ul>
              <ul class="reward-condition" v-else>
                <li>投资期限：≥{{item.daysScope}}天</li>
                <li>投资金额：≥{{item.formatAmountScope}}元</li>
                <li v-if="item.vaildCalcType == 'forever'">有效期：无限制</li>
                <li v-else-if="item.vaildCalcType == 'bytime'">有效期：{{item.formatStartDate}} - {{item.formatEndDate}}
                </li>
                <li v-else-if="item.vaildCalcType == 'bydate'">有效期：{{item.formatStartDate}} - {{item.formatEndDate}}
                </li>
                <li>编号：{{item.couponCode}}</li>
              </ul>
              <router-link tag="button" to="/product" class="btn btn-warning-hollow" v-if="item.status == 'un_used'">
                去使用
              </router-link>
            </div>
          </div>
        </infinitescroll>
      </div>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        profitList: '',
        profitPage: 0,
        profitSize: 10
      }
    },
    created() {
      this.loadProfitList()
    },
    methods: {
      goBack() {
        this.$router.push({path: '/account'})
      },
      loadProfitList() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/mcCoupon/list?type=profit&page=' + this.profitPage + '&size=' + this.profitSize).then(res => {
          if (res.success) {
            var _profitList = res.result.content
            if(_profitList === undefined){
              _profitList = null
            }
            this.profitList = [...this.profitList, ...(_profitList || [])];
            if (_profitList === null || _profitList.length < this.profitSize || this.profitPage === 10) {
              // 所有数据加载完毕
              this.$refs.loadProfitList.$emit('cf.infinitescroll.loadedDone');
              return;
            }
            // 单次请求数据完毕
            this.$refs.loadProfitList.$emit('cf.infinitescroll.finishLoad');
            this.profitPage++;
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        });
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/reward.styl"
</style>
