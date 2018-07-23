<template>
  <layout>
    <div class="tab header-tab">
      <div class="tab-head">
      <i class="back-icon" @click="goBack()"></i>
      <ul class="tab-nav">
        <li class="tab-nav-item tab-active">
          <router-link to="./cash_reward">红包</router-link>
        </li>
        <li class="tab-nav-item">
          <router-link to="./profit_reward">加息券</router-link>
        </li>
      </ul>
      </div>
      <div class="tab-panel">
        <div class="notavailable" v-show="this.cashList.length == 0">
          <img src="../../../../static/images/notavailable/not_reward.png" alt="暂无红包~" class="not_icon">
          <p class="not_txt">暂无红包~</p></div>
        <infinitescroll :on-infinite="loadCashList" ref="loadCashList" v-show="this.cashList.length !== 0">
          <div slot="list" class="reward-list">
            <div class="reward-item " v-for="item in cashList"
                 :class="[item.status == 'processing' ? '-processing': '',item.status == 'used' ? '-used': '',item.status == 'overdue' ? '-overdue': '']">
              <h3>{{item.couponName}}</h3>
              <div class="reward-number">{{item.amount}}<span>元</span></div>
              <ul class="reward-condition" v-if="item.status == 'used' || item.status == 'processing'">
                <li>使用项目：{{item.cashProjectName}}</li>
                <li>使用时间：{{item.formatUsedTime}}</li>
                <li>编号：{{item.couponCode}}</li>
              </ul>
              <ul class="reward-condition" v-else>
                <li>项目期限：≥{{item.daysScope}}天</li>
                <li>投资金额：≥{{item.formatAmountScope}}元</li>
                <!--<li>有效期：{{item.formatStartDate}} - {{item.formatEndDate}}</li>-->
                <li v-if="item.vaildCalcType == 'forever'">有效期：长期有效</li>
                <li v-else-if="item.vaildCalcType == 'bytime'">有效期：{{item.formatStartDate}} - {{item.formatEndDate}}
                </li>
                <li v-else-if="item.vaildCalcType == 'bydate'">有效期：{{item.formatStartDate}} - {{item.formatEndDate}}
                </li>
                <li>编号：{{item.couponCode}}</li>
              </ul>
              <router-link tag="button" to="/product" class="btn btn-primary-hollow" v-if="item.status == 'un_used'">
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
        cashList: '',
        cashPage: 0,
        cashSize: 10
      }
    },
    created() {
      this.loadCashList()
    },
    methods: {
      goBack() {
        this.$router.push({path: '/account'})
      },
      loadCashList() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/mcCoupon/list?type=cash&page=' + this.cashPage + '&size=' + this.cashSize).then(res => {
          if (res.success) {
            var _cashList = res.result.content
            if(_cashList === undefined){
              _cashList = null
            }
            this.cashList = [...this.cashList, ...(_cashList || [])];
            if (_cashList === null || _cashList.length < this.cashSize || this.cashPage === 10) {
              // 所有数据加载完毕
              this.$refs.loadCashList.$emit('cf.infinitescroll.loadedDone');
              return;
            }
            // 单次请求数据完毕
            this.$refs.loadCashList.$emit('cf.infinitescroll.finishLoad');
            this.cashPage++;
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
