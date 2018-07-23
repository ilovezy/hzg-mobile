<template>
  <layout :showTabbar="true" class="bg-white">
    <nav slot="navbar" class="product-header" :style="isInvestSurprise ? 'z-index: 3000': ''" :class="isInvestSurprise ? 'fixed': '' ">
      <h1>
        <i class="back-icon" @click="goBack()"></i><span @click="goBack()" class="title">{{product.name}}</span><i v-if="product.novice == true" class="novice">新手专享</i>
      </h1>
    </nav>
    <div class="product-detail">
      <div class="product-base">
        <div class="product-prop">
          <dl>
            <dt>预期年化</dt>
            <dd><span>{{product.formatScale2ExpectAnnualizedRate}}</span>%
              <i v-if="product.extraAnnualizedRate>0">+ {{product.formatScale2ExtraAnnualizedRate}}%</i>
            </dd>
          </dl>
          <dl>
            <dt>项目期限</dt>
            <dd><span>{{product.period}}</span> {{product.formatPeriodType}}</dd>
          </dl>
        </div>
        <ul class="product-progress">
          <li v-if="product.status == 'collection_end' || product.status == 'payed' ">实际募得金额：{{product.formatScale2InvestAmount}}</li>
          <li v-else>剩余可投：{{product.formatRemainAmount}} 元</li>
          <li>
            <div class="progressbar">
              <i :style="{width:(product.investAmount * 100 / product.totalAmount) + '%'}"></i>
              <span v-if="(product.investAmount * 100 / product.totalAmount).toFixed(2) === 'NaN'">0 %</span>
              <span v-else>{{(product.investAmount * 100 / product.totalAmount).toFixed(2)}} %</span>
            </div>
          </li>
          <li>项目总额：{{product.formatScale2TotalAmount}} 元</li>
        </ul>
        <span class="btn-invest-surprise" @click="isInvestSurprise = true"></span>
      </div>
      <!--项目进度-->
      <section class="product-props">
        <div class="props-item">
          <label class="title">当前阶段：</label>
          <span class="content" v-if="product.status == 'wait_collection'">{{product.formatStatus}} </span>
          <div class="content" v-if="product.status == 'collection'">
            <div class="status">
              {{product.formatStatus}} <i class="icon-question" @click="toastNone()"></i>
            </div>
            <div class="stop-time">
              <countdown :time="product.saleEndTimeCountDown" timetype="second" class="countdown" :callback="function(){refreshPage()}">
                <i>{%d}</i>天 <i>{%h}</i>时 <i>{%m}</i>分 <i>{%s}</i>秒
              </countdown>
              <p class="text">距募集期截止</p>
            </div>
          </div>
          <span class="content collection_end" v-if="product.status == 'collection_end' || product.status == 'loan_finished'">{{product.formatStatus}}</span>
          <span class="content payed" v-if="product.status == 'payed'">{{product.formatStatus}}</span>
        </div>
        <div class="props-item">
          <label class="title">成立日期：</label>
          <span class="content" v-if="product.formatDateEstablishTime == undefined">募集期截止或项目100%募集</span><span class="content" v-else>{{product.formatDateEstablishTime}}</span>
        </div>
        <div class="props-item">
          <label class="title">起息时间：</label> <span class="content">T（成立日）＋{{product.interestFrom}}</span>
        </div>
        <div class="props-item">
          <label class="title">收益方式：</label> <span class="content" v-text="product.formatProfitType"></span>
        </div>
        <div class="props-item">
          <label class="title">认购起点：</label>
          <span class="content">{{product.formatScale2MinInvestAmount}}元，递增金额{{product.formatScale2IncrementAmount}}元</span>
        </div>
        <div class="link-product-detail" @click="getProductDetails()"><i class="icon-arrow-up"></i> 点击查看详情</div>
      </section>
    </div>
    <!--投资按钮 & 判断新手标-->
    <div class="btn-invest" slot="tabbar" v-if="product.novice == true && accountInfo.hasInvested == true">
      <button class="btn-disabled btn-block">新手专享</button>
    </div>
    <div class="btn-invest" slot="tabbar" v-else>
      <button class="btn-primary-hollow btn-block" v-if="product.status == 'wait_collection'">距离募集开始
        <countdown :time="product.startTimeCountDown" timetype="second" class="countdown-detail" format="<i>{%h}</i>:<i>{%m}</i>:<i>{%s}</i>" doneText="" :callback="refreshPage">
        </countdown>
      </button>
      <button class="btn-primary btn-block" v-else-if="product.status == 'collection'" @click="openInvest">立即投资</button>
      <button class="btn-disabled btn-block" v-else-if="product.status == 'collection_end' || product.status == 'loan_finished'">{{product.formatStatus}}</button>
      <button class="btn-disabled btn-block" v-else-if="product.status == 'payed'">{{product.formatStatus}}</button>
    </div>
    <!-- 投资表单 -->
    <popup v-model="isInvestFrom" class="invest-from" position="bottom" height="auto">
      <cell-group class="invest-amount">
        <cell-item>
          <span slot="left">投资金额</span> <input slot="right" v-model="investAmount" type="text" placeholder="请输入">
          <span slot="right">元</span>
        </cell-item>
        <div class="invest-tips" v-if="investAmount == ''">{{product.formatScale2MinInvestAmount}}元起购，{{product.formatScale2IncrementAmount}}元递增</div>
        <div class="invest-tips error" v-else-if="investAmount > product.remainAmount">
          <i class="icon-warn "></i>投资金额不能大于剩余可投金额
        </div>
        <div class="invest-tips error" v-else-if="investAmount !== '' && investAmount < product.minInvestAmount || (investAmount * 100 - product.minInvestAmount * 100) % (product.incrementAmount * 100) !== 0 ">
          <i class="icon-warn"></i>{{product.formatScale2MinInvestAmount}}元起购，{{product.formatScale2IncrementAmount}}元递增
        </div>
        <div class="invest-tips error" v-else-if="product.remainAmount >= product.minInvestAmount * 2 && product.minInvestAmount > product.remainAmount - investAmount && investAmount != product.remainAmount">
          <i class="icon-warn "></i>请一次性投满,或至少留下{{this.product.minInvestAmount}}元!
        </div>
        <div class="invest-tips error" v-else-if="product.minInvestAmount * 2 > product.remainAmount && product.minInvestAmount !== product.remainAmount && investAmount != product.remainAmount">
          <i class="icon-warn "></i>请全部认购剩余金额
        </div>
        <div class="invest-tips warning" v-else-if="profitCoupon.amount > 0">
          <i class="icon-earnings"></i> 预期收益¥{{(investAmount * ((product.expectAnnualizedRate + product.extraAnnualizedRate + profitCoupon.amount) / 100) * product.period / 365).toFixed(2)}}
        </div>
        <div class="invest-tips warning" v-else>
          <i class="icon-earnings"></i> 预期收益¥{{(investAmount * ((product.expectAnnualizedRate + product.extraAnnualizedRate) / 100) * product.period / 365).toFixed(2)}}
        </div>
      </cell-group>
      <cell-group>
        <cell-item arrow v-if="cashList.length !== 0">
          <label slot="left">使用红包</label> <select slot="right" v-model="cashCoupon">
          <option value="0">请选择</option>
          <option v-for="item in cashList" :value="item">{{item.amount}}元 (投资≥{{item.formatAmountScope}}元，期限≥{{item.daysScope}}天)</option>
        </select>
        </cell-item>
        <cell-item class="balance-status" :class="investAmount > myFund.availableBalance ? 'false' : ''">
          <span slot="left">使用余额</span>
          <div slot="right" v-if="!investAmount || investAmount > myFund.availableBalance">
            <i class="icon-warn"></i>可用余额{{myFund.formatAvailableBalance}}元
          </div>
          <div slot="right" style="color: #d82d2d" v-else-if="investAmount - cashCoupon.amount <= 0">您投资的金额不能小于红包使用限额</div>
          <div slot="right" v-else-if="cashCoupon.amount > 0">{{investAmount - cashCoupon.amount}}元</div>
          <div slot="right" v-else>{{investAmount}}元</div>
          <router-link tag="button" to="/account/recharge" slot="right" class="btn btn-hollow">充值</router-link>
        </cell-item>
        <cell-item arrow v-if="profitList.length !== 0">
          <span slot="left">使用加息券</span> <select slot="right" v-model="profitCoupon">
          <option value="0">请选择</option>
          <option v-for="item in profitList" :value="item">{{item.amount}}% (投资≥{{item.formatAmountScope}}，期限≥{{item.daysScope}}天)</option>
        </select>
        </cell-item>
        <cell-item>
          <span slot="left">验证码</span>
          <input type="tel" slot="right" v-model="smsCode" maxlength="6" placeholder="短信验证码">
          <div slot="right" class="sms-codes">
            <span class="identification" v-show="identificationShow">识别码<br>{{identification}}</span>
            <sendcode v-model="sendCodeStart" @click.native="sendCode" runStr="{%s}秒" :second="second" type="warning" style="width: 1.5rem"></sendcode>
          </div>
        </cell-item>
      </cell-group>
      <div class="cell-button">
        <button class="btn-disabled btn-block" v-if="investAmount < product.minInvestAmount || investAmount > myFund.availableBalance || investAmount > product.remainAmount || (investAmount * 100 - product.minInvestAmount * 100) % (product.incrementAmount * 100) !== 0">立即投资</button>
        <button class="btn-disabled btn-block" v-else-if="product.remainAmount >= product.minInvestAmount * 2 && product.minInvestAmount > product.remainAmount - investAmount && investAmount != product.remainAmount">立即投资</button>
        <button class="btn-disabled btn-block" v-else-if="product.minInvestAmount * 2 > product.remainAmount && product.minInvestAmount !== product.remainAmount && investAmount != product.remainAmount">立即投资</button>
        <button class="btn-disabled btn-block" v-else-if="investAmount - cashCoupon.amount <= 0">立即投资</button>
        <button class="btn-disabled btn-block" v-else-if="!smsCode">立即投资</button>
        <button class="btn-disabled btn-block" v-else-if="!investLoading">立即投资</button>
        <button class="btn-primary btn-block" v-else @click="submitInvest()">立即投资</button>
      </div>
    </popup>
    <!--投资小惊喜-->
    <popup v-model="isInvestSurprise" class="invest-surprise" :style="isInvestSurprise ? 'display:block': 'display:none'" :class="isAppdown ? '' : '-appdown'" position="top" height="auto">
      <div class="tips">＊项目成立后发放</div>
      <router-link to="/article/notice/111" class="surprise-explain">奖励说明></router-link>
      <ul class="surprise-info">
        <li>
          <dl>
            <dd>18</dd>
            <dt>积分</dt>
          </dl>
          <div class="title">一马当先</div>
          <div class="content" v-if="product.firstInvestor == undefined">虚位以待</div>
          <div class="content" v-else>{{product.firstInvestor}}</div>
        </li>
        <li>
          <dl>
            <dd>68</dd>
            <dt>积分</dt>
          </dl>
          <div class="title">一鸣惊人</div>
          <div class="content" v-if="product.mostInvestor == undefined">虚位以待</div>
          <div class="content" v-else>{{product.mostInvestor}}</div>
        </li>
        <li>
          <dl>
            <dd>38</dd>
            <dt>积分</dt>
          </dl>
          <div class="title">一锤定音</div>
          <div class="content" v-if="product.lastInvestor == undefined">虚位以待</div>
          <div class="content" v-else>{{product.lastInvestor}}</div>
        </li>
      </ul>
      <icon name="arrow-up" class="close" size=".4rem" @click.native="isInvestSurprise = false"></icon>
    </popup>
    <!-- 项目详情-->
    <popup v-model="isProductDetail" class="product-details" :class=" isProductDetail ? '': '-show'" position="bottom" height="100%">
      <nav class="product-header">
        <h1>
          <i class="icon-close" style="margin-right: .05rem" @click="isProductDetail = false"></i>
          <span @click="isProductDetail = false" class="title">{{product.name}}</span>
          <i v-if="product.novice == true" class="novice">新手专享</i>
        </h1>
      </nav>
      <tab class="product-details-tab">
        <span class="badge badge-danger" v-if="icInvestRecordTotalElements>0 && icInvestRecordTotalElements <= 89">{{icInvestRecordTotalElements}}</span>
        <span class="badge badge-danger" v-if="icInvestRecordTotalElements>99 ">99+</span>
        <tab-panel label="项目信息">
          <div v-if="icProjectDescPojo.projectType === 'baoli'">
            <div class="project-group">
              <h3 class="project-header">项目简介</h3>
              <div class="project-body" v-text="icProjectDescPojo.intro"></div>
            </div>
            <div class="project-group" v-if="icProjectDescPojo.descEnterprise !== undefined">
              <h3 class="project-header">债权转让方介绍</h3>
              <div class="project-body" v-text="icProjectDescPojo.descEnterprise.remarks"></div>
            </div>
            <div class="project-group" v-if="icProjectDescPojo.seller.interestedVisible !== false">
              <h3 class="project-header">基础资产方介绍</h3>
              <div class="project-body" v-if="icProjectDescPojo.seller.name !== undefined" v-text="icProjectDescPojo.seller.name + icProjectDescPojo.seller.intro"></div>
              <div class="project-body" v-else v-text="icProjectDescPojo.seller.intro"></div>
            </div>
            <div class="project-group">
              <h3 class="project-header">基础资产保障措施</h3>
              <div class="project-body" v-text="icProjectDescPojo.safeguardMeasure"></div>
            </div>
            <div class="project-group">
              <h3 class="project-header">还款来源</h3>
              <div class="project-body" v-text="icProjectDescPojo.repaySource"></div>
            </div>
            <div class="project-group">
              <h3 class="project-header">风险揭示</h3>
              <div class="project-body">
                投资人系依赖于自己的独立判断在本项目项下进行投资，投资人在做出投资决策前，应全面了解相关投资标的，谨慎决策；任何通过长富理财进行的交易并不能避免以下风险的产生，该等风险需由投资人自行承担：<br>1. 政策风险：有关法律、法规及相关政策、规则发生变化，可能引起投资收益等方面异常波动，投资人有可能遭受损失；<br>2. 违约风险：因其他交易方无力或无意愿按时足额履约，投资人有可能遭受损失；<br>3. 利率风险：市场利率变化可能对购买或持有产品的实际收益产生影响；<br>4. 不可抗力因素导致的风险；<br>5. 因投资人的过错导致的任何损失，该过错包括但不限于：决策失误、操作不当、遗忘或泄露密码、密码被他人破解、投资人使用的计算机系统被第三方侵入、投资人委托他人代理交易时他人恶意或不当操作而造成的损失；<br>6. 平台注册协议提示的其他风险。<br>※以上并不能揭示投资人通过平台进行投资的全部风险及市场的全部情形。平台作为信息中介机构为投资人提供信息发布、信息撮合服务，不对任何投资人及/或任何交易提供任何明示或默示的担保承诺。平台提供的各种信息及资料仅供参考，投资人应依其独立判断做出决策。投资人据此进行投资交易的，产生的投资风险由投资人自行承担，信息中介机构即平台不承担任何责任。
              </div>
            </div>
          </div>
          <div v-if="icProjectDescPojo.projectType === 'enterprise_invest'">
            <div class="project-group">
              <h3 class="project-header">项目简介</h3>
              <div class="project-body" v-text="icProjectDescPojo.intro"></div>
            </div>
            <div class="project-group" v-if="icProjectDescPojo.descEnterprise !== undefined">
              <h3 class="project-header">借款企业信息</h3>
              <div class="project-body" v-text="icProjectDescPojo.descEnterprise.remarks"></div>
            </div>
            <div class="project-group">
              <h3 class="project-header">资金用途</h3>
              <div class="project-body" v-text="icProjectDescPojo.fundsUse"></div>
            </div>
            <div class="project-group">
              <h3 class="project-header">还款来源</h3>
              <div class="project-body" v-text="icProjectDescPojo.repaySource"></div>
            </div>
            <div class="project-group">
              <h3 class="project-header">风控措施</h3>
              <div class="project-body" v-text="icProjectDescPojo.riskControl"></div>
            </div>
            <div class="project-group">
              <h3 class="project-header">风险揭示</h3>
              <div class="project-body">
                投资人系依赖于自己的独立判断在本项目项下进行投资，投资人在做出投资决策前，应全面了解相关投资标的，谨慎决策；任何通过长富理财进行的交易并不能避免以下风险的产生，该等风险需由投资人自行承担：<br>1. 政策风险：有关法律、法规及相关政策、规则发生变化，可能引起投资收益等方面异常波动，投资人有可能遭受损失；<br>2. 违约风险：因其他交易方无力或无意愿按时足额履约，投资人有可能遭受损失；<br>3. 利率风险：市场利率变化可能对购买或持有产品的实际收益产生影响；<br>4. 不可抗力因素导致的风险；<br>5. 因投资人的过错导致的任何损失，该过错包括但不限于：决策失误、操作不当、遗忘或泄露密码、密码被他人破解、投资人使用的计算机系统被第三方侵入、投资人委托他人代理交易时他人恶意或不当操作而造成的损失；<br>6. 平台注册协议提示的其他风险。<br>※以上并不能揭示投资人通过平台进行投资的全部风险及市场的全部情形。平台作为信息中介机构为投资人提供信息发布、信息撮合服务，不对任何投资人及/或任何交易提供任何明示或默示的担保承诺。平台提供的各种信息及资料仅供参考，投资人应依其独立判断做出决策。投资人据此进行投资交易的，产生的投资风险由投资人自行承担，信息中介机构即平台不承担任何责任。
              </div>
            </div>
          </div>
        </tab-panel>
        <tab-panel label="公示材料">
          <div class="notavailable" v-if="icProjectDescPojo.projectFiles == undefined">
            <img src="../../../static/images/notavailable/not_product.png" alt="暂无公示材料~" class="not_icon">
            <p class="not_txt">暂无公示材料~</p>
          </div>
          <div class="project-image-list" v-else>
            <dl class="project-image-item" v-for="item in icProjectDescPojo.projectFiles">
              <dt v-text="item.name"></dt>
              <dd><img :src="item.savePath"></dd>
            </dl>
          </div>
        </tab-panel>
        <tab-panel label="投资纪录">
          <div class="notavailable" v-show="this.icInvestRecord.length == 0">
            <img src="../../../static/images/notavailable/not_product.png" alt="暂无投资记录~" class="not_icon">
            <p class="not_txt">暂无投资记录~</p>
          </div>
          <infinitescroll :on-infinite="loadInvestRecordList" ref="loadInvestRecordList" v-show="this.icInvestRecord.length !== 0">
            <div slot="list" class="investRecord-list" v-if="icInvestRecord !== undefined && icInvestRecord !== null">
              <div class="investRecord-item" v-for="item in icInvestRecord">
                <h3>{{item.formatMobileOrName}}</h3>
                <p>{{item.transactionTime}}</p>
                <span class="money">¥{{item.formatInvestAmount}}</span>
                <div class="surprise">
                  <span class="surprise-item" v-if="item.firstInvestor==true"><i class="icon-reward18"></i>一马当先</span>
                  <span class="surprise-item" v-if="item.mostInvestor==true"><i class="icon-reward68"></i>一鸣惊人</span>
                  <span class="surprise-item" v-if="item.lastInvestor==true"><i class="icon-reward38"></i>一锤定音</span>
                </div>
              </div>
            </div>
          </infinitescroll>
        </tab-panel>
      </tab>
    </popup>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        product: {
          name:'长富理财',
          formatScale2ExpectAnnualizedRate: '0.00',
          period: 0,
          formatPeriodType: '天',
          formatRemainAmount: '0.00',
          formatScale2TotalAmount: '0.00',
          formatScale2MinInvestAmount: '0.00',
          formatScale2IncrementAmount: '0.00',
          formatProfitType: '到期还本付息'
        },//产品信息
        isInvestSurprise: false,//是否显示马鸣锤
        isInvestFrom: false,//是否显示投资表单
        isProductDetail: false,//是否显示产品详情
        investParameter: {},
        investAmount: '',//投资金额
        userAmout: '',//用户金额
        investCash: '',//投资使用红包金额
        investProfit: '',//投资使用加息券
        extraAmout: 0,//加息券
        cashCoupon: 0,//投资红包
        profitCoupon: 0,//投资加息券
        myFund: '',//账户资金
        accountInfo: {
          investor: false
        },//账户信息
        cashList: '',//红包列表
        profitList: '',//加息券列表
        icProjectDescPojo: {
          remarks: '',
          bondingCompany: '',
          buyer: '',
          descEnterprise: '',
          intro: '',
          repaySource: '',
          safeguardMeasure: '',
          seller: ''
        },//查看产品详情信息
        icInvestRecordTotalElements: '',
        icInvestRecord: '',//投资列表
        icInvestRecordPage: 0,
        icInvestRecordSize: 10,
        smsCode: '',
        second: 60,
        sendCodeStart: false,
        identification: '',
        identificationShow: false,
        isAppdown: false,
        investLoading: true,
      }
    },
    created() {
      this.getProduct()
    },
    methods: {
      //头部返回路由
      goBack() {
        this.$router.back()
      },
      refreshPage(){
        this.$router.go(0)
      },
      toastNone() {
        this.$dialog.toast({mes: '<p style="font-size: .26rem">项目从募集开始到募集结束的这段时间。</p>', timeout: 3000});
      },
      getProduct() {
        if(sessionStorage.getItem('appdown') === 'false'){
          this.isAppdown = true
        }
        //获取项目信息
        this.$dialog.loading.open('数据加载中...');
        //获取项目数据
        this.axios.get('security/icProject/view/' + this.$route.params.productId).then(res => {
          if (res.success) {
            this.product = res.result
            const _accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
            if (_accountInfo !== null) {
              this.accountInfo = _accountInfo
            }
          } else if (res.error === 'PROJECT_NOT_EXIST_ERROR') {
            this.$dialog.confirm({
              mes: res.errorDescription,
              opts: [{
                txt: '查看其他项目',
                color: true,
                callback: () => {
                  this.$router.push({path: '/product'})
                }
              }]
            });
          } else {
            this.$dialog.toast({mes: res.errorDescription});
          }
        })
      },
      openInvest() {
        //开启投资表单
        if (localStorage.getItem('token') !== null) {
          if (this.product.remainAmount === 0) {
            this.$dialog.confirm({
              mes: '来迟一步，项目已投满，查看其他项目。',
              opts: [{
                txt: '知道了',
                color: true,
                callback: () => {
                  this.$router.replace('/product')
                }
              }]
            });
            return
          }
          this.getAccount()
        } else {
          localStorage.clear()
          this.$router.push({path: '/login'})
        }
      },
      getAccount() {
        //获取账户信息
        this.accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
//        console.log(this.accountInfo)
        if (this.accountInfo.status === 'un_auth') {
          this.$dialog.confirm({
            mes: '您尚未开通渤海银行资金存管账户，<br>开通后方可进行相应操作',
            opts: [{
              txt: '取消',
              color: false
            }, {
              txt: '立即开通',
              color: true,
              callback: () => {
//                this.axios.get('auth/ucMemebe/to/certification').then(res => {
//                  window.location.href = res.result
//                })
                this.$router.push('/account/certification')
              }
            }]
          });
        } else {
          this.getAccountFund()
        }
      },
      getAccountFund() {
        //获取账户资金
        this.axios.get('auth/finBalance/detail').then(res => {
          if (res.success) {
            this.myFund = res.result
            if (this.myFund.availableBalance < this.product.minInvestAmount) {
              this.$dialog.confirm({
                mes: '您的可用余额小于起投金额，<br>先充值后方可进行投资。',
                opts: [{
                  txt: '取消',
                  color: false
                }, {
                  txt: '立即充值',
                  color: true,
                  callback: () => {
                    this.$router.replace('/account/recharge')
                  }
                }]
              });
            } else {
              this.getCash()
            }
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      getCash() {
        //获取红包信息
        this.axios.get('auth/mcCoupon/investList?type=cash').then(res => {
          if (res.success) {
            var _cashList = res.result
            if (_cashList !== undefined) {
              var _temp = new Array();
              for (var i = 0; i < _cashList.length; i++) {
                if (this.product.period >= _cashList[i].daysScope) {
                  _temp.push(_cashList[i])
                }
              }
              this.cashList = _temp
            }
            this.getProfit()
          }
        })
      },
      sendCode() {
        this.$dialog.loading.open('验证码发送中...');
        this.axios.post('auth/transaction/certification/tppSendUapMsg').then(res => {
          if (res.success) {
            this.identification = res.result
            this.sendCodeStart = true
            this.identificationShow = true
            this.$dialog.toast({mes: '验证码发送成功', icon: 'success'});
          } else {
            this.$dialog.toast({mes: res.errorDescription});
            if (this.referenceMobiles !== '') {
              this.referenceMobile = this.referenceMobiles
            }
          }
        })
      },
      getProfit() {
        //获取加息券信息
        this.axios.get('auth/mcCoupon/investList?type=profit').then(res => {
          if (res.success) {
            var _profitList = res.result
            if (_profitList !== undefined) {
              var _temp = new Array();
              for (var i = 0; i < _profitList.length; i++) {
                if (this.product.period >= _profitList[i].daysScope) {
                  _temp.push(_profitList[i])
                }
              }
              this.profitList = _temp
            }
            this.isInvestFrom = true
          }
        })
      },
//      setPayPassword(){
//        this.$dialog.loading.open('前往银行存管设置...');
//        this.axios.post('auth/ucMemebe/certification/passwordSet').then(res => {
//          document.write(res)
//        }, res => {
//          this.$dialog.toast({mes: '系统繁忙，请稍后再试', timeout: 10000, icon: 'error'})
//        })
//      },
      submitInvest() {
        if (this.cashCoupon.id !== undefined) {
          if (this.cashCoupon.amountScope > this.investAmount) {
            this.$dialog.confirm({
              mes: '您投资的金额不能小于红包使用限额。',
              opts: [{
                txt: '知道了，重新选择',
                color: true
              }]
            });
            return
          } else if (this.cashCoupon.amount > this.investAmount) {
            this.$dialog.confirm({
              mes: '您投资的金额不能小于红包使用限额。',
              opts: [{
                txt: '知道了，重新选择',
                color: true
              }]
            });
            return
          } else {
            this.userAmout = this.investAmount - this.cashCoupon.amount
          }
        } else {
          this.userAmout = this.investAmount
        }
        if (this.profitCoupon.id !== undefined) {
          if (this.profitCoupon.amountScope > this.investAmount) {
            this.$dialog.confirm({
              mes: '您投资的金额不能小于加息券使用限额。',
              opts: [{
                txt: '知道了，重新选择',
                color: true
              }]
            });
            return
          }
        }
        if (this.cashCoupon.id === undefined && this.profitCoupon.id === undefined) {
          this.investParameter.investAmount = this.investAmount
          this.investParameter.projectId = this.product.id
          this.investParameter.userAmout = this.userAmout
          this.investParameter.smsCode = this.smsCode
        } else if (this.cashCoupon.id === undefined && this.profitCoupon.id !== undefined) {
          this.investParameter.investAmount = this.investAmount
          this.investParameter.profitCouponID = this.profitCoupon.id
          this.investParameter.projectId = this.product.id
          this.investParameter.userAmout = this.userAmout
          this.investParameter.smsCode = this.smsCode
        } else if (this.cashCoupon.id !== undefined && this.profitCoupon.id === undefined) {
          this.investParameter.investAmount = this.investAmount
          this.investParameter.cashCouponID = this.cashCoupon.id
          this.investParameter.projectId = this.product.id
          this.investParameter.userAmout = this.userAmout
          this.investParameter.smsCode = this.smsCode
        } else if (this.cashCoupon.id !== undefined && this.profitCoupon.id !== undefined) {
          this.investParameter.investAmount = this.investAmount
          this.investParameter.cashCouponID = this.cashCoupon.id
          this.investParameter.profitCouponID = this.profitCoupon.id
          this.investParameter.projectId = this.product.id
          this.investParameter.userAmout = this.userAmout
          this.investParameter.smsCode = this.smsCode
        }
        //提交投资
        this.$dialog.loading.open('投资处理中...');
        this.investLoading = false
        this.axios.post('auth/transaction/certification/order', this.investParameter).then(res => {
          if (res.success) {
            this.$router.push({name: 'invest_success', params: res.result})
            this.investLoading = true
          } else {
            this.$dialog.toast({mes: res.errorDescription});
            this.investLoading = true
          }
        })
      },
      //获取项目详情
      getProductDetails() {
        this.isProductDetail = true
        //项目数据laoding
        this.$dialog.loading.open('数据加载中...');
        //获取项目信息数据
        this.axios.get('security/icProject/getDescription/' + this.$route.params.productId).then(res => {
          //判断数据是否正常
          if (res.success) {
            this.icProjectDescPojo = res.result
          } else {
            //数据接口错误返回错误信息
            this.$dialog.toast({mes: res.errorDescription});
//              this.$router.push({path:'/product'})
          }
        })
        //获取投资记录
        this.icInvestRecord = ''
        this.icInvestRecordPage = 0
        this.$refs.loadInvestRecordList.$emit('cf.infinitescroll.reInit');
        this.loadInvestRecordList()
      },
      //获取投资记录
      loadInvestRecordList() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('security/icProject/getTcTransactions/' + this.$route.params.productId + '?page=' + this.icInvestRecordPage + '&size=' + this.icInvestRecordSize).then(res => {
          this.icInvestRecordTotalElements = res.result.totalElements
          var _icInvestRecord = res.result.content
          if (_icInvestRecord === undefined) {
            _icInvestRecord = null
          }
          this.icInvestRecord = [...this.icInvestRecord, ...(_icInvestRecord || [])];
          if (_icInvestRecord === null || _icInvestRecord.length < this.icInvestRecordSize || this.icInvestRecordPage === 100) {
            // 所有数据加载完毕
            this.$refs.loadInvestRecordList.$emit('cf.infinitescroll.loadedDone');
            return;
          }
          // 单次请求数据完毕
          this.$refs.loadInvestRecordList.$emit('cf.infinitescroll.finishLoad');
          this.icInvestRecordPage++;
        });
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .product-header
    height: .9rem
    background-color #cf2d2d
    padding: 0 .3rem
    position: relative
    &.fixed
      z-index 3000
    h1
      display flex
      height: .9rem
      align-items: center;
      color #fff
      font-size .32rem
      font-weight normal
      .back-icon:before
        color #fff
      .title
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        max-width 70%
      .novice
        display inline-block
        background: #f9b841
        border: 1px solid #f9b841
        border-radius: .5rem
        color #d82d2d
        padding: 0 0.1rem
        font-size .2rem
        margin-left .1rem
        height: .3rem
        line-height .3rem
        vertical-align: middle
        white-space nowrap
  .btn-invest-surprise
    position: absolute
    right: .2rem
    top: 0
    width: 1rem
    height: 1.42rem
    background: url("../../../static/images/proudct/icon_surprise.png") no-repeat center;
    background-size: 100% 100%
  .product-detail
    .product-base
      position: relative
      background-color: rgb(216, 45, 45)
    .product-prop
      padding: .8rem .3rem
      display: flex
      & dl
        width 50%
      dt
        font-size .24rem
        color: rgba(255, 168, 174, 1)
      dd
        color: white
        font-size: .3rem
        span
          font-size: .6rem
    .product-progress
      background-color: rgba(216, 45, 45, 1)
      padding: 0 .3rem .5rem
      color #fff
      .progressbar
        display: block
        padding: 0
        margin: .15rem 0
        height: .08rem
        border-radius: .5rem
        background: rgba(204, 42, 42, 1)
        position: relative
        i
          position: absolute
          left: 0
          right: 0
          top: 0
          width 0
          height: .08rem
          border-radius: .5rem
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.50) 0%, #ffffff 97%);
          transition: all 1s linear;
          &:after
            display: block
            width .18rem
            height: .18rem
            background-color: rgba(245, 39, 53, 1)
            border-radius 100%;
            border: .04rem solid #fff
            box-shadow: 0 .03rem .06rem 0 #ffffff;
            content: ''
            position: absolute
            right: -.1rem
            top: -.05rem
        span
          position: absolute
          right: 0
          top: .2rem
          color: rgba(255, 168, 174, 1)
      & li:last-child
        color: rgba(255, 168, 174, 1)
    .product-props
      background-color: #fff
      margin-bottom -.2rem
      .props-item
        position: relative
        padding: .2rem .3rem .2rem 1.65rem
        color: #666
        &:first-child
          border-bottom: .04rem solid #eee
          min-height: 1.2rem
          margin-bottom .2rem
        .title
          float: left
          margin-left: -1.35rem
          width 1.35rem
          white-space nowrap
        .content
          position: relative
          display block
          .text
            padding-top .05rem
            font-size .2rem
            color #bbb
        .collection_end:before
        .payed:before
          content ''
          position: absolute
          right: 0
          top: -.6rem
          width 2rem
          height: 1.48rem
          background url("../../../static/images/proudct/detail_collection_end.png") no-repeat left top
          background-size 2rem 1.48rem
        .payed:before
          background-image url("../../../static/images/proudct/detail_payed.png")
      .link-product-detail
        padding .5rem .3rem .3rem
        font-size .24rem
        color #bbb
    .stop-time
      position: absolute
      right: 0
      top: 0
      text-align right
  .countdown-detail
    display inline-block
    color #d82d2d
    font-size .18rem
    height: .48rem
    margin-top .02rem
    vertical-align top
    i
      background-color #d82d2d
      display: inline-block
      width .48rem
      height: .48rem
      line-height .45rem
      margin: 0 .04rem
      text-align: center
      color #fff
      border: 1px solid #d82d2d
      border-radius .1rem
      font-size: .24rem
      vertical-align middle
  .invest-surprise
    position relative
    &.-appdown
      .popup-top
        margin-top .85rem
    .surprise-explain
      position absolute
      right 0
      top: 1.2rem
      width 1.4rem
      height .4rem
      line-height .4rem
      border-radius .4rem 0 0 .4rem
      color rgba(255, 168, 174, 1)
      font-size .2rem
      display inline-block
      background-color #ea2b43
      text-align: center
    .popup
      padding .9rem 0 .7rem 0
      background: rgba(204, 42, 42, .9);
    .surprise-info
      overflow hidden
      margin 0 auto
      width 6.7rem
      text-align: center;
      & li
        float left
        margin-right .2rem
        width 2.1rem
        height 2.2rem
        background url("../../../static/images/proudct/invest_surprise.png") no-repeat center top
        background-size 2.1rem 2.2rem
        color #fff
        &:last-child
          margin-right 0
        .content
          font-size .2rem
          color #fac158
      dl
        height: 1.25rem
        color #db1726
        dd
          font-size .4rem
          font-weight bold
          line-height 1
          padding-top .3rem
        dt
          font-size .2rem
    .tips
      margin .3rem auto
      width 6.7rem
      text-align: left
      font-size: .2rem
      color: #ffa8ae
    .close
      position absolute
      left 50%
      bottom .1rem
      margin-left -.3rem
      color: rgba(255, 255, 255, 0.7)
  .identification
    position: absolute
    display inline-block
    top: -.08rem
    right: 1.6rem
    width .8rem
    padding .02rem 0
    line-height 1.2
    text-align: center;
    font-size .2rem
    background: #fafafa;
    border: 1px solid #eeeeee;
  .sms-codes
    position relative
  .btn-invest
    position: relative
    display: flex
    width: 100%
    padding: .15rem .3rem
    background-color: #fff
  .product-details
    position relative
    z-index 10000
    background-color transparent
    &.-show
      display: none
      .popup
        display: none
    .product-header
      position: fixed
      top: 0
      left: 0
      right: 0
  .product-details-tab
    padding-top 1.75rem
    height 100%
    .tab-nav
      position: fixed
      top: .9rem
      left: 0
      right: 0
      width 100%
    .tab-panel
      overflow initial
      background-color #f5f5f5
      height: 100%
      .badge
        position: absolute
        left: 88%
        top: -.75rem
        z-index 11000
      .tab-panel-item
        padding: .0 .3rem
        height: 100%
        overflow-y: auto
        overflow-x: hidden
        -webkit-overflow-scrolling: touch
  .invest-from
    position relative
    z-index 3100
    .cell-button
      padding-top 0
      padding-bottom .15rem
    .popup
      background-color #f5f5f5
      .cell-left
        width 1.5rem
        margin-right .2rem
    .invest-amount
      width auto
      .cell-item:after
        height: 0
        border-bottom 0
    .invest-tips
      border-bottom 1px solid #eee
      color #999
      padding .15rem .3rem
      background-color #fafafa
      &.error
        color #d82d2d
      &.warning
        color #f2a10c
  //可用余额状态
  .balance-status
    position relative
    .cell-right
      .icon-warn
        display none
      div
        flex 1
        text-align: left;
    &.false
      .cell-right
        color #d82d2d
      .icon-warn
        display inline-block
  .project-group
    padding: .3rem 0
    color #666
    font-size .28rem
    border-bottom 1px solid #eee
    &:last-child
      border-bottom none
    .project-header
      position relative
      color #333
      padding-bottom .15rem
      font-weight normal
      & i
        position absolute
        left -.35rem
    .project-body
      font-weight 300
      white-space normal
      word-wrap: break-word
  .project-image-list
    padding-top .3rem
    .project-image-item
      position relative
      margin-bottom .3rem
      & dt
        color #666
        padding-bottom .1rem
      & dd
        border: .1rem solid #d8d8d8
        & img
          width 100%
          display block
          overflow hidden
  .investRecord-item
    padding: .3rem 0
    position: relative
    border-bottom 1px solid #eee
    font-size .28rem
    color: #666
    &:last-child
      border-bottom none
    & h3
      font-weight normal
    & p
      padding-top .1rem
      font-size .2rem
      color #bbb
    .money
      position: absolute
      right: 0
      top: .3rem
    .surprise
      position absolute
      left: 2.2rem
      top: .28rem
      font-size .2rem
      color #d82d2d
      & span
        position: relative
        display inline-block
        white-space nowrap
        & i
          display block
          margin: 0 auto
          font-size .36rem
          text-align: center;
</style>
