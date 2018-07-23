<template>
  <layout :showNavbar="isNavbar">
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="quest">
      <cell-group title="1.您的年龄是？" v-show="showQuest1">
        <cell-item type="radio">
          <span slot="left">A.18-30</span> <input slot="right" type="radio" value="-2" v-model="quest1"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">B.31-50</span> <input slot="right" type="radio" value="0" v-model="quest1"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">C.51-65</span> <input slot="right" type="radio" value="-4" v-model="quest1"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">D.高于65岁（如选D，需着重关注客户投资经验）</span>
          <input slot="right" type="radio" value="-10" v-model="quest1"/>
        </cell-item>
        <div class="cell-button">
          <button class="btn-primary" style="margin-left: 0;" @click="show1()">下一题</button>
        </div>
      </cell-group>
      <cell-group title="2.您家庭的就业状况是？" v-show="showQuest2">
        <cell-item type="radio">
          <span slot="left">A.您与配偶均有稳定收入的工作</span> <input slot="right" type="radio" value="10" v-model="quest2"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">B.您与配偶其中一人有稳定收入的工作</span> <input slot="right" type="radio" value="5" v-model="quest2"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">C.您与配偶均没有稳定收入的工作或者已退休</span> <input slot="right" type="radio" value="0" v-model="quest2"/>
        </cell-item>
        <div class="cell-button">
          <button class="btn-hollow" @click="hide2()">上一题</button>
          <button class="btn-primary" @click="show2()">下一题</button>
        </div>
      </cell-group>
      <cell-group title="3.在您每年的家庭收入中，可用于作金融投资（储蓄存款除外）的比例为？" v-show="showQuest3">
        <cell-item type="radio">
          <span slot="left">A.小于10%</span> <input slot="right" type="radio" value="2" v-model="quest3"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">B.10%至25%</span> <input slot="right" type="radio" value="4" v-model="quest3"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">C.25%至50%</span> <input slot="right" type="radio" value="8" v-model="quest3"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">D.大于50%</span> <input slot="right" type="radio" value="10" v-model="quest3"/>
        </cell-item>
        <div class="cell-button">
          <button class="btn-hollow" @click="hide3()">上一题</button>
          <button class="btn-primary" @click="show3()">下一题</button>
        </div>
      </cell-group>
      <cell-group title="4.以下哪项最能说明您的投资经验？" v-show="showQuest4">
        <cell-item type="radio">
          <span slot="left">A.除存款、国债外，我几乎不投资其他金融产品</span> <input slot="right" type="radio" value="0" v-model="quest4"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">B.大部分投资于存款、国债等，较少投资于股票、基金等风险产品</span>
          <input slot="right" type="radio" value="2" v-model="quest4"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">C.资产均衡地分布于存款、国债、银行理财产品、信托产品、股票、基金等</span>
          <input slot="right" type="radio" value="6" v-model="quest4"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">D.大部分投资于股票、基金、外汇等高风险产品，较少投资于存款、国债</span>
          <input slot="right" type="radio" value="10" v-model="quest4"/>
        </cell-item>
        <div class="cell-button">
          <button class="btn-hollow" @click="hide4()">上一题</button>
          <button class="btn-primary" @click="show4()">下一题</button>
        </div>
      </cell-group>
      <cell-group title="5.您有多少年投资股票、基金、外汇、金融衍生产品等风险投资品的经验？" v-show="showQuest5">
        <cell-item type="radio">
          <span slot="left">A.没有经验</span> <input slot="right" type="radio" value="0" v-model="quest5"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">B.少于2年</span> <input slot="right" type="radio" value="2" v-model="quest5"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">C.2至5年</span> <input slot="right" type="radio" value="6" v-model="quest5"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">D.5至8年</span> <input slot="right" type="radio" value="8" v-model="quest5"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">E.8年以上</span> <input slot="right" type="radio" value="10" v-model="quest5"/>
        </cell-item>
        <div class="cell-button">
          <button class="btn-hollow" @click="hide5()">上一题</button>
          <button class="btn-primary" @click="show5()">下一题</button>
        </div>
      </cell-group>
      <cell-group title="6.以下哪项描述最符合您的投资态度？" v-show="showQuest6">
        <cell-item type="radio">
          <span slot="left">A.厌恶风险，不希望本金损失，希望获得稳定回报</span> <input slot="right" type="radio" value="0" v-model="quest6"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">B.保守投资，不希望本金损失，愿意承担一定幅度的收益波动</span>
          <input slot="right" type="radio" value="4" v-model="quest6"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">C.寻求资金的较高收益和成长性，愿意为此承担有限本金损失</span>
          <input slot="right" type="radio" value="8" v-model="quest6"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">D.希望赚取高回报，愿意为此承担较大本金损失</span> <input slot="right" type="radio" value="10" v-model="quest6"/>
        </cell-item>
        <div class="cell-button">
          <button class="btn-hollow" @click="hide6()">上一题</button>
          <button class="btn-primary" @click="show6()">下一题</button>
        </div>
      </cell-group>
      <cell-group title="7.以下情况，您会选择哪一种？" v-show="showQuest7">
        <cell-item type="radio">
          <span slot="left">A.有100%的机会赢取1000元现金</span> <input slot="right" type="radio" value="0" v-model="quest7"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">B.有50%的机会赢取5万元现金</span> <input slot="right" type="radio" value="4" v-model="quest7"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">C.有25%的机会赢取50万元现金</span> <input slot="right" type="radio" value="6" v-model="quest7"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">D.有10%的机会赢取100万元现金</span> <input slot="right" type="radio" value="10" v-model="quest7"/>
        </cell-item>
        <div class="cell-button">
          <button class="btn-hollow" @click="hide7()">上一题</button>
          <button class="btn-primary" @click="show7()">下一题</button>
        </div>
      </cell-group>
      <cell-group title="8.您计划的投资期限是多久？" v-show="showQuest8">
        <cell-item type="radio">
          <span slot="left">A.1年以下</span> <input slot="right" type="radio" value="4" v-model="quest8"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">B.1－3年</span> <input slot="right" type="radio" value="6" v-model="quest8"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">C.3－5年</span> <input slot="right" type="radio" value="8" v-model="quest8"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">D.5年以上</span> <input slot="right" type="radio" value="10" v-model="quest8"/>
        </cell-item>
        <div class="cell-button">
          <button class="btn-hollow" @click="hide8()">上一题</button>
          <button class="btn-primary" @click="show8()">下一题</button>
        </div>
      </cell-group>
      <cell-group title="9.您的投资目的是 ？" v-show="showQuest9">
        <cell-item type="radio">
          <span slot="left">A.资产保值</span> <input slot="right" type="radio" value="2" v-model="quest9"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">B.资产稳健增长</span> <input slot="right" type="radio" value="6" v-model="quest9"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">C.资产迅速增长</span> <input slot="right" type="radio" value="10" v-model="quest9"/>
        </cell-item>
        <div class="cell-button">
          <button class="btn-hollow" @click="hide9()">上一题</button>
          <button class="btn-primary" @click="show9()">下一题</button>
        </div>
      </cell-group>
      <cell-group title="10.您投资产品的价值出现何种程度的波动时，您会呈现明显的焦虑？" v-show="showQuest10">
        <cell-item type="radio">
          <span slot="left">A.本金无损失，但收益未达预期</span> <input slot="right" type="radio" value="-5" v-model="quest10"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">B.出现轻微本金损失</span> <input slot="right" type="radio" value="5" v-model="quest10"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">C.本金10％以内的损失</span> <input slot="right" type="radio" value="10" v-model="quest10"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">D.本金20-50％的损失</span> <input slot="right" type="radio" value="15" v-model="quest10"/>
        </cell-item>
        <cell-item type="radio">
          <span slot="left">E.本金50％以上损失</span> <input slot="right" type="radio" value="20" v-model="quest10"/>
        </cell-item>
        <div class="cell-button">
          <button class="btn-hollow" @click="hide10()">上一题</button>
          <button class="btn-primary" @click="submitQuestionnaire()">提交</button>
        </div>
      </cell-group>
    </div>
  </layout>
</template>
<script>
  export default {
    data () {
      return {
        isNavbar: true,
        accountInfo: '',
        quest1: '0.1',
        quest2: '0.1',
        quest3: '0.1',
        quest4: '0.1',
        quest5: '0.1',
        quest6: '0.1',
        quest7: '0.1',
        quest8: '0.1',
        quest9: '0.1',
        quest10: '0.1',
        arr: [],
        num: 0,
        state: '',
        dialogData: {},
        showQuest1: true,
        showQuest2: false,
        showQuest3: false,
        showQuest4: false,
        showQuest5: false,
        showQuest6: false,
        showQuest7: false,
        showQuest8: false,
        showQuest9: false,
        showQuest10: false
      }
    },
    created(){
      this.isOsAccess()
      this.getMemberInfo()
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      isOsAccess(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          this.isNavbar = false //false 为不显示顶部标题
        }
      },
      getMemberInfo(){
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/ucMemebe/info').then(res => {
          if (res.success) {
            this.accountInfo = res.result
            localStorage.setItem('accountinfo',JSON.stringify(this.accountInfo))
          } else if( res.error === 'MEMBER_TOKEN_INVALID_ERROR'){
            this.$dialog.toast({mes: res.errorDescription})
            //返回，去登录咯
            if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
              window.location.href = 'cflc://jsbridge?type=action&name=login'
            } else {
              localStorage.clear()
              this.$router.replace('/login')
            }
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      show1: function () {
        if (this.quest1 == '0.1') {
          this.$dialog.toast({mes: '您尚未选择，请做出您的选择!', timeout: 1500});
        } else {
          this.showQuest1 = false;
          this.showQuest2 = true;
        }
      },
      show2: function () {
        if (this.quest2 == '0.1') {
          this.$dialog.toast({mes: '您尚未选择，请做出您的选择!', timeout: 1500});
        } else {
          this.showQuest2 = false;
          this.showQuest3 = true;
        }
      },
      hide2: function () {
        this.showQuest2 = false;
        this.showQuest1 = true
      },
      show3: function () {
        if (this.quest3 == '0.1') {
          this.$dialog.toast({mes: '您尚未选择，请做出您的选择!', timeout: 1500});
        } else {
          this.showQuest3 = false;
          this.showQuest4 = true;
        }
      },
      hide3: function () {
        this.showQuest3 = false;
        this.showQuest2 = true
      },
      show4: function () {
        if (this.quest4 == '0.1') {
          this.$dialog.toast({mes: '您尚未选择，请做出您的选择!', timeout: 1500});
        } else {
          this.showQuest4 = false;
          this.showQuest5 = true;
        }
      },
      hide4: function () {
        this.showQuest4 = false
        this.showQuest3 = true
      },
      show5: function () {
        if (this.quest5 == '0.1') {
          this.$dialog.toast({mes: '您尚未选择，请做出您的选择!', timeout: 1500});
        } else {
          this.showQuest5 = false
          this.showQuest6 = true
        }
      },
      hide5: function () {
        this.showQuest5 = false;
        this.showQuest4 = true
      },
      show6: function () {
        if (this.quest6 == '0.1') {
          this.$dialog.toast({mes: '您尚未选择，请做出您的选择!', timeout: 1500});
        } else {
          this.showQuest6 = false
          this.showQuest7 = true;
        }
      },
      hide6: function () {
        this.showQuest6 = false;
        this.showQuest5 = true
      },
      show7: function () {
        if (this.quest7 == '0.1') {
          this.$dialog.toast({mes: '您尚未选择，请做出您的选择!', timeout: 1500});
        } else {
          this.showQuest7 = false
          this.showQuest8 = true;
        }
      },
      hide7: function () {
        this.showQuest7 = false;
        this.showQuest6 = true
      },
      show8: function () {
        if (this.quest8 == '0.1') {
          this.$dialog.toast({mes: '您尚未选择，请做出您的选择!', timeout: 1500});
        } else {
          this.showQuest8 = false
          this.showQuest9 = true;
        }
      },
      hide8: function () {
        this.showQuest8 = false;
        this.showQuest7 = true
      },
      show9: function () {
        if (this.quest9 == '0.1') {
          this.$dialog.toast({mes: '您尚未选择，请做出您的选择!', timeout: 1500});
        } else {
          this.showQuest9 = false
          this.showQuest10 = true;
        }
      },
      hide9: function () {
        this.showQuest9 = false;
        this.showQuest8 = true
      },
      hide10: function () {
        this.showQuest10 = false;
        this.showQuest9 = true
      },
      submitQuestionnaire: function (e) {
        this.num = parseInt(this.quest1) + parseInt(this.quest2) + parseInt(this.quest3) + parseInt(this.quest4) + parseInt(this.quest5) + parseInt(this.quest6) + parseInt(this.quest7) + parseInt(this.quest8) + parseInt(this.quest9) + parseInt(this.quest10);
        if (this.num >= 81 && this.num <= 100) {
          this.state = '激进型'
        } else if (this.num >= 61 && this.num <= 80) {
          this.state = '进取型'
        } else if (this.num >= 41 && this.num <= 60) {
          this.state = '平衡型'
        } else if (this.num >= 21 && this.num <= 40) {
          this.state = '稳健型'
        } else if (this.num <= 20) {
          this.state = '谨慎型'
        }
        this.$dialog.loading.open('数据提交中...');
        this.axios.post('auth/ucMemebe/updateEvaluationScore?evaluationScore=' + this.state).then(res => {
          if (res.success) {
            if (this.num >= 81 && this.num <= 100) {
              this.$dialog.confirm({
                title: '您的风险承受能力评估结果为\"激进型\"',
                mes: '您属于可以承受高风险类型的投资投资者，您适合投资于能够为您提供高升值能力而投资价值波动大的投资工具。最坏的情况下，您可能失去全部投资本金并需对您投资所导致的任何亏损承担责任',
                opts: [{
                  txt: '确定',
                  color: true,
                  callback: () => {
                    this.isGoCallback()
                  }
                }]
              });
            } else if (this.num >= 61 && this.num <= 80) {
              this.$dialog.confirm({
                title: '您的风险承受能力评估结果为\"进取型\"',
                mes: '您属于可以承担中等至高风险类型的投资者。您适合投资于能够为您提供升值能力，而投资价值有波动的投资工具。',
                opts: [{
                  txt: '确定',
                  color: true,
                  callback: () => {
                    this.isGoCallback()
                  }
                }]
              });
            } else if (this.num >= 41 && this.num <= 60) {
              this.$dialog.confirm({
                title: '您的风险承受能力评估结果为\"平衡型\"',
                mes: '您属于可以承担中等风险类型的投资者。您适合投资于能够为您提供温和升值能力，而投资价值有温和波动的投资工具。',
                opts: [{
                  txt: '确定',
                  color: true,
                  callback: () => {
                    this.isGoCallback()
                  }
                }]
              });
            } else if (this.num >= 21 && this.num <= 40) {
              this.$dialog.confirm({
                title: '您的风险承受能力评估结果为\"稳健型\"',
                mes: '您属于可以承担低至中等风险类型的投资者。您适合投资于能够权衡保本而亦有若干升值能力的投资工具。',
                opts: [{
                  txt: '确定',
                  color: true,
                  callback: () => {
                    this.isGoCallback()
                  }
                }]
              });
            } else if (this.num <= 20) {
              this.$dialog.confirm({
                title: '您的风险承受能力评估结果为\"谨慎型\"',
                mes: '您属于可以承担低风险而作风谨慎类型的投资者。您适合投资于以保本为主的投资工具，但您因此会牺牲资本升值的机会。',
                opts: [{
                  txt: '确定',
                  color: true,
                  callback: () => {
                    this.isGoCallback()
                  }
                }]
              });
            }
          } else {
            this.$dialog.toast({mes: res.errorDescription})
            if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
              localStorage.clear()
              window.location.href = 'cflc://jsbridge?type="event"&name=login'
              this.$router.replace('/login')
            } else {
              localStorage.clear()
              this.$router.replace('/login')
            }
          }
        })
      },
      isGoCallback(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          localStorage.clear()
          window.location.href = 'cflc://jsbridge?type=event&name=close'
        } else {
          this.updateAccountInfo()
        }
      },
      updateAccountInfo(){
        //更新用户信息
        this.axios.get('auth/ucMemebe/info').then(res => {
          if (res.success) {
            this.accountInfo = res.result
            localStorage.setItem('accountinfo', JSON.stringify(res.result))
            this.$dialog.toast({mes: '评测完成', icon: 'success'})
            this.$router.push('/account/settings')
          }
        })
      }
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .quest
    height: 100px
    .cell:first-child
      margin-top 0
    .cell-title
      padding .3rem
      color #333
      font-size .36rem
    .cell-item
      padding .3rem
    .cell-left
      max-width 80%
      white-space normal
    .cell-right
      min-height auto
    .cell-button
      padding-top .3rem
      background-color #f5f5f5
      display flex
      .btn-primary
      .btn-hollow
        display table
        max-width 100%
        flex 1
        height: .8rem
        font-size .34rem
        border-radius: 0.12rem;
        &:last-child
          margin-left .3rem
      .btn-primary
        border: 0
</style>
