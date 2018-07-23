<template>
  <ul class="lottery-game">
    <li>
      <div class="lottery-item" :class="[{active : activeClass[index]}]" v-for="(prize,index) in lis1">
        <div class="prize-box">
          <div class="pic"><img :src="prize.img"></div>
          <div class="name">{{prize.txt}}</div>
        </div>
      </div>
    </li>
    <li>
      <div class="lottery-item" :class="[{active : activeClass[7]}]">
        <div class="prize-box">
          <div class="pic"><img :src="prizesList[7].img"></div>
          <div class="name">{{prizesList[7].txt}}</div>
        </div>
      </div>
      <div v-if="activeStatus === 'notstart'" class="lottery-item btn-lottery"
           :class="activeStatus === 'notstart' ? '-gray': '' ">
        <div class="prize-box">
          <span>活动<br>未开始</span>
        </div>
      </div>
      <div v-else-if="activeStatus === 'start'" class="lottery-item btn-lottery" :class="islogin ? '-login': '' "
           @click="startLottery">
        <div class="prize-box">
          <span>立即抽奖</span>
        </div>
      </div>
      <div v-else-if="activeStatus === 'end'" class="lottery-item btn-lottery"
           :class="activeStatus === 'end' ? '-gray': '' ">
        <div class="prize-box">
          <span>活动<br>已结束</span>
        </div>
      </div>
      <div class="lottery-item" :class="[{active : activeClass[3]}]">
        <div class="prize-box">
          <div class="pic"><img :src="prizesList[3].img"></div>
          <div class="name">{{prizesList[3].txt}}</div>
        </div>
      </div>
    </li>
    <li>
      <div class="lottery-item" :class="[{active : activeClass[6-index]}]" v-for="(prize,index) in lis2">
        <div class="prize-box">
          <div class="pic"><img :src="prize.img"></div>
          <div class="name">{{prize.txt}}</div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script type="text/javascript">
  export default {
    name: 'lottery',
    data() {
      return {
        activeClass: [false, false, false, false, false, false, false, false],
        index: -1,
        count: 8,
        timer: null,
        times: 0,
        speedData: 100,
        lock: false,
        afterLotteryHandler: null
      };
    },
    props: {
      islogin: false,
      activeStatus: {
        type: String,
      },
      prizesList: {
        type: Array,
        default() {
          return [];
        }
      },
      lotteryBtn: {
        type: String
      },
      beforeLottery: {
        type: Function,
        default() {
          throw new Error('you must define beforeLottery before draw a lottery ');
        }
      },
      afterLottery: {
        type: Function,
        // eslint-disable-next-line
        default() {
          console.warn('you can use afterLottery after rolling');
        }
      },
      prize: {
        type: Number,
        default: 0
      },
      speed: {
        type: Number,
        default: 100
      },
      cycle: {
        type: Number,
        default: 30
      }
    },
    computed: {
      lis1() {
        return this.prizesList.slice(0, 3);
      },
      lis2() {
        return this.prizesList.slice(4, 7).reverse();
      }
    },
    created() {
      this.speedData = this.speed;
      this.afterLotteryHandler = this.afterLottery;
    },
    beforeDestroy() {
      this.afterLotteryHandler = () => {
      };
    },
    methods: {
      startLottery() {
        if (!this.lock) {
          let promise = () => {
            return new Promise((resolve, reject) => {
              this.beforeLottery(resolve, reject);
              this.lock = true;
            });
          };
          let start = async () => {
            try {
              await promise();
              this.roll();
            } catch (e) {
              this.lock = false;
            }
          };
          start();
        }
      },
      _rollHandler() {
        var index = this.index;
        var count = this.count;
        for (let i = 0, len = this.activeClass.length; i < len; i++) {
          this.activeClass[i] = false;
        }
        index += 1;
        if (index > count - 1) {
          index = 0;
        }
        this.activeClass[index] = true;
        this.index = index;
        return false;
      },
      roll() {
        // eslint-disable-next-line
        this.activeClass = this.activeClass.map(item => item = false);
        this.times += 1;
        this._rollHandler();
        if (this.times > this.cycle + 10 && this.prize == this.index) {
          clearTimeout(this.timer);
          setTimeout(() => {
            this._showResult();
            this.lock = false;
          }, 1000);
          this.index = -1;
          this.count = 8;
          this.timer = null;
          this.speedData = this.speed;
          this.times = 0;
        } else {
          if (this.times < this.cycle) {
            this.speedData -= 2;
          } else {
            if (this.times > this.cycle + 10 && ((this.prize == 0 && this.index == 7) || this.prize == this.index + 1)) {
              this.speedData += 110;
            } else {
              this.speedData += 20;
            }
          }
          if (this.speedData < 40) {
            this.speedData = 40;
          }
          this.timer = setTimeout(
            () => {
              this.roll();
            }
            , this.speedData);
        }
        return false;
      },
      _showResult() {
        this.afterLotteryHandler();
      }
    }
  };
</script>

<style lang='less'>
  ul.lottery-game {
    margin: 0 auto;
    padding-top: .06rem;
    box-sizing: border-box;
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    li {
      padding: .06rem 0 0 .114rem;
      overflow: hidden;
      display: flex;
      position: relative;
      .lottery-item {
        position: relative;
        margin: 0 .06rem 0 0;
        width: 1.8rem;
        height: 1.58rem;
        .prize-box {
          padding-top: .1rem;
          width: 1.8rem;
          height: 1.58rem;
          border: .04rem solid #000;
          background-color: #fff;
          border-radius: .06rem;
          text-align: center;
          .pic {
            display: flex;
            margin: 0 auto;
            width: 1rem;
            height: 1rem;
            text-align: center;
            flex-direction: column;
            justify-content: center;
            img {
              margin: 0 auto;
              max-width: 1rem;
              max-height: .94rem;
            }
          }
        }
        .name {
          font-size: .24rem;
          color: #731a0a;
        }
        &:before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: .06rem;
          background: rgba(0, 0, 0, 0.4);
        }
        &.btn-lottery {
          .prize-box {
            background-color: #bb2309;
            padding: 0;
            span {
              display: block;
              padding: .28rem .4rem 0;
              line-height: 1.2;
              height: 1.4rem;
              border-radius: .02rem .02rem .15rem .15rem;
              color: #fff;
              font-size: .36rem;
              font-weight: bold;
              background-color: #f13c1c;
            }
          }
          &.-login {
            .prize-box {
              padding: 0;
              span {
                padding-top: .1rem;
              }
            }
          }
          &.-gray {
            .prize-box {
              padding: 0;
              background-color: #424242;
              span {
                background-color: #737373;
                padding: .28rem .2rem 0;
              }
            }
          }
        }
        &.btn-lottery:before,
        &.active:before {
          background-color: transparent;
        }
      }
    }
  }

</style>
