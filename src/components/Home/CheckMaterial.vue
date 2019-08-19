<template>
  <div>
    <!--    ball button -->
    <div class="float_button">
      <router-link class="toWorkList" :to="{name: 'WorkList'}">
        >
      </router-link>
    </div>
    <!--    title submit form -->
    <div class="title-submit">
      <div class="input-group mb-2">
        <div class="input-group-prepend">
          <label for="QR" class="input-group-text" id="basic-addon1">QR</label>
        </div>
        <input onfocus="this.select()" onmouseover="this.focus()" id="QR" type="text" class="form-control"
               placeholder="扫描二维码" v-model="QR" @keyup.enter="sendQR">
      </div>
      <div class="input-group mt-0 mb-0">
        <div class="input-group-prepend">
          <label class="input-group-text">工单号: </label>
        </div>
        <div class="form-control" v-text="wocode"></div>
      </div>
      <div class="input-group">
        <div class="input-group-prepend">
          <label class="input-group-text">批次号: </label>
        </div>
        <div class="form-control" v-text="batch"></div>
      </div>
    </div>
    <!--    count -->
    <div class="tip-group mt-2 mb-2">
      <div class="tip total pl-1">
        总数: <span class="badge badge-light" v-text="total"></span>
      </div>
      <div class="tip checked ml-3 pl-1">
        已检料: <span class="badge badge-light" v-text="completed"></span>
      </div>
      <button class="unlock btn" @click="unlock()">解锁</button>
    </div>
    <!--    table-->
    <div class="data-list table">
      <thead class="data-list-head">
      <tr class="nav pr-0">
        <th class="col-6" scope="col">物料代码</th>
        <th class="col-6" scope="col">检料状态</th>
      </tr>
      </thead>
      <div class="wrapper" ref="wrapper">
        <div class="content nav">
          <tr class="col-12" v-for="(item, index) in dataList" :key="index">
            <td :class="{'first-item':(index === 0)}"
                class="col-8">{{item.MaterialCode}}
            </td>
            <td :class="{'first-item':(index === 0), 'checkedState':(item.State === 3)}"
                class="col-4">{{StateList[item.State].StateName}}
            </td>
          </tr>
          <tr class="col-12" v-if="StopUpdate === true">
            <td class="col-12">没有更多</td>
          </tr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import axios from 'axios'

export default {
  name: 'CheckMaterial',

  data () {
    return {
      // 二维码
      QR: '',
      // 数据列表
      dataList: [],
      StateList: {},
      // 请求字段
      number: 0,
      StopUpdate: false,
      //
      total: 0,
      completed: 0,
      wocode: '',
      batch: ''
    }
  },
  methods: {

    jsonList2json (jsonList, keyStr) {
      let json = {}
      for (let i = 0, len = jsonList.length; i < len; i++) {
        let value = jsonList[i]
        let key = value[keyStr]
        json[key] = value
      }
      return json
    },

    sendQR () {
      // 发送请求
      var self = this
      let param = new URLSearchParams()
      param.append('batch', self.batch)
      param.append('number', self.number)
      param.append('qrcode', self.QR)
      param.append('wocode', self.wocode)
      axios({
        method: 'post',
        // url: 'checkMaterial_1/',
        url: 'api/checkMaterial_1/',
        data: param
      })
        .then(res => {
          console.log('success')
          res = res.data
          if (res.error === 0) {
            console.log(res)
            self.wocode = res.data.Wocode
            self.batch = res.data.Batch
            self.total = res.data.TotalCount
            self.completed = res.data.CompleteCount
            self.dataList = res.data.MaterialList
            self.StateList = res.data.StateList
            console.log(self.dataList)
          } else {
            alert('请重新扫描二维码')
          }
        })
        .catch(res => {
          console.log(res)
          alert('与服务器连接超时')
        })
    },

    unlock () {
      var self = this
      self.wocode = ''
      self.batch = ''
    },

    requestData () {
      var self = this
      self.number += 1
      if (self.StopUpdate === true) {
        return
      }
      let param = new URLSearchParams()
      param.append('batch', self.batch)
      param.append('number', self.number)
      axios({
        method: 'post',
        url: 'api/checkMaterial_1/',
        data: param
      })
        .then(res => {
          console.log('success update')
          res = res.data
          if (res.error === 0) {
            console.log(res)
            self.dataList = self.dataList.concat(res.data.MaterialList)
          } else {
            self.StopUpdate = true
          }
        })
        .catch(res => {
          console.log(res)
          alert('与服务器连接超时,获取失败')
        })
    }
  },

  mounted () {
  },

  updated () {
  },

  created () {
    // Bundle QR input
    this.$nextTick(() => {
      document.getElementById('QR').focus()
    })

    // BScroll
    this.number = 0
    this.$nextTick(() => {
      if (!this.scroll) {
        // this.scroll = new BScroll(this.$refs.wrapper, {})
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: true,
          // bounce: false,
          preventDefault: false,
          tap: true,
          mouseWheel: true,
          scrollY: true,
          pullUpLoad: {
            threshold: -50 // 当上拉距离超过20px时触发 pullingUp 事件
          }
        })
        this.scroll.on('pullingUp', () => {
          this.requestData()
          this.scroll.finishPullUp() // 事情做完，需要调用此方法告诉 better-scroll 数据已加载，否则下拉事件只会执行一次
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .float_button {
    position: fixed;
    width: 4rem;
    height: 4rem;
    top: 50%;
    right: 5%;
    font-size: 4rem;
    line-height: 4rem;
    text-align: center;
    color: white;
    background-color: #e9ecef;
    border-radius: 5rem;
    z-index: 10;

    .toWorkList {
      text-decoration: none;
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 5rem;
    }
  }

  .title-submit {
    margin: 0 auto;
    width: 100vw;
    padding: 0 5vw;
    height: 32vw;

    div div label {
      font-size: 1.4rem;
    }

    .input-group {
      height: 10vw;
      width: auto;

      input {
        height: 10vw;
      }

      .form-control {
        font-size: 1.4rem;
        height: 10vw;
        line-height: 10vw;
        padding-top: 0;
        padding-bottom: 0;
      }
    }
  }

  .tip-group {
    margin: 0 auto;
    padding: 0 5vw;
    width: 100vw;
    height: 8vw;
    text-align: left;

    .tip {
      padding: 0 1vw;
      height: 100%;
      width: auto;
      background-color: rgb(255, 126, 14);
      font-size: 1.3rem;
      line-height: 8vw;
      text-align: center;
      display: inline-block;

      .badge {
        height: auto;
        padding: 1vw 2vw;
        font-size: 1.2rem;
      }
    }

    .unlock {
      float: right;
      height: 100%;
      font-size: 1.3rem;
      line-height: 0;
      background-color: rgb(255, 126, 14);
      display: block;

      &:active {
        background-color: #6c757d;
        color: #fff;
      }
    }
  }

  .data-list {
    /*height: auto;*/
    height: calc(100vh - 60vw - 1.5rem);

    .data-list-head {
      width: 100vw;
      height: 10vw;
      display: block;

      .nav {
        padding-left: 0;
      }

      tr {
        height: 100%;

        th {
          height: 100%;
          font-size: 1.3rem;
        }
      }
    }

    .wrapper {
      height: calc(100vh - 70vw - 1.5rem);
      overflow: hidden;
      z-index: 100;
      width: 100vw;

      .content {
        height: auto;
        width: 100vw;

        tr {
          display: flex;

          td {
            font-size: 1.3rem;
          }

          .first-item {
            border-top: none;
          }

          .checkedState {
            background-color: green;
            color: #fff;
          }
        }
      }
    }
  }
</style>
