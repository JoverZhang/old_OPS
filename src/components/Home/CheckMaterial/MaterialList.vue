<template>
  <div>
    <!--    title submit form -->
    <Search class="search mb-2" ref="search_input" @search="search" :inputColor="inputColor"/>

    <div class="show-numbers mb-2">
      <div class="input-group">
        <div class="input-group-prepend">
          <label class="input-group-text">工单号: </label>
        </div>
        <div class="form-control" v-text="Wocode"></div>
      </div>

      <div class="input-group">
        <div class="input-group-prepend">
          <label class="input-group-text">批次号: </label>
        </div>
        <div class="form-control" v-text="Batch"></div>
      </div>
    </div>

    <!--    count -->
    <div class="show-status nav mb-2">
      <div class="status-left col-8">
        <button type="button" class="btn btn-primary">
          总数：
          <span class="badge badge-light">
          {{TotalCount}}
        </span>
        </button>
        <button type="button" class="btn btn-primary">
          已检料：
          <span class="badge badge-light">
          {{CompleteCount}}
        </span>
        </button>
      </div>
      <div class="status-right col-4">
        <button class="unlock btn " @click="unlock()">解锁</button>
      </div>
    </div>

    <!--    table-->
    <div class="material-list table">
      <thead class="data-list-head">
      <tr class="nav pr-0">
        <th class="col-1" scope="col">#</th>
        <th class="col-8" scope="col">物料代码</th>
        <th class="col-3" scope="col">检料状态</th>
      </tr>
      </thead>
      <div class="wrapper" ref="wrapper">
        <div class="content nav">
          <tr class="col-12" v-for="(item, index) in MaterialList" :key="index">
            <td :class="{'first-item':(index === 0)}"
                class="item-1 col-1">{{index}}
            </td>
            <td :class="{'first-item':(index === 0)}"
                class="item-2 col-8">{{item.MaterialCode}}
            </td>
            <td :class="{'first-item':(index === 0), 'checkedState':(item.State == 3)}"
                class="item-3 col-3">{{StateRender(item.State)}}
            </td>
          </tr>
          <tr class="nav col-12" v-if="StopUpdate === true">
            <td class="col-12" style="text-align: center">没有更多</td>
          </tr>
          <div class="content-end"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import BScroll from 'better-scroll'

import Search from './Search'
import {MessageBox} from 'mint-ui'

export default {
  name: 'MaterialList',

  props: ['sendBatch', 'stateList'],

  data () {
    return {
      // send
      QR: '',

      // lazyload
      number: 1,
      StopUpdate: false,

      // receive
      Wocode: '',
      Batch: '',
      TotalCount: 0,
      CompleteCount: 0,
      MaterialList: [],
      // StateList: [],

      // normal
      inputColor: ''
    }
  },

  computed: {
    StateRender (n) {
      return function (n) {
        return (this.stateList[n].StateName)
      }
    }
  },

  mounted () {
    let self = this

    // Authentication
    if ((self.$store.state.role).indexOf('1') === -1) {
      console.log('not role')
      return
    }

    // Bundle QR input
    this.$nextTick(() => {
      document.getElementById('QR').focus()
    })

    // BScroll
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

    // Init Query
    let param = new URLSearchParams()
    param.append('token', self.$store.state.token)
    param.append('batch', self.sendBatch)
    axios({
      method: 'post',
      url: 'api/CheckMaterial/MaterialSearch/',
      data: param
    })
      .then(res => {
        res = res.data
        if (res.error === 0) {
          console.log('res:', res)
          self.Wocode = res.data.Wocode
          self.Batch = res.data.Batch
          self.TotalCount = res.data.TotalCount
          self.CompleteCount = res.data.CompleteCount
          self.MaterialList = res.data.MaterialList
          console.log(self.Wocode)
          console.log(self.Batch)
          console.log(self.TotalCount)
          console.log(self.CompleteCount)
          console.log(self.MaterialList)
        } else {
          console.log('%c' + 'error != 0', 'color:#f00')
          let errorInfo = {
            1: '请输入正确的批次号',
            2: '该批次未找到对应工单',
            3: '该批次没有配料记录'
          }
          MessageBox.alert(errorInfo[res.error])
        }
      })
      .catch(res => {
        console.log('res:', res)
        alert('与服务器连接超时,获取失败')
      })
  },

  watch: {},

  methods: {
    search (QR) {
      let self = this
      console.log('test' + QR)
      console.log(self.Batch)
      let param = new URLSearchParams()
      param.append('token', self.$store.state.token)
      param.append('qrcode', QR)
      param.append('batch', self.Batch)
      axios({
        method: 'post',
        url: 'api/CheckMaterial/Material_QRSearch/',
        data: param
      })
        .then(res => {
          res = res.data
          if (res.error === 0) {
            console.log('res:', res)
            self.Wocode = res.data.Wocode
            self.Batch = res.data.Batch
            self.TotalCount = res.data.TotalCount
            self.CompleteCount = res.data.CompleteCount
            self.MaterialList = res.data.MaterialList
            // self.inputColor = 'rgb(152,255,101)'
            self.inputColor = '#0c0'
            console.log(self.Wocode)
            console.log(self.Batch)
            console.log(self.TotalCount)
            console.log(self.CompleteCount)
            console.log(self.MaterialList)
            console.log(self.inputColor)
          } else {
            let errorInfo = {
              1: '请输入正确的批次号',
              3: '该批次没有配料记录',
              4: '请输入正确的二维码',
              5: '该二维码不是配料二维码',
              6: '该二维码未找到有效内容',
              9: '不在该检料的批次内',
              10: '该分包已检料完成'
            }
            self.inputColor = '#f00'
            MessageBox.alert(errorInfo[res.error]).then(action => {
              // Bundle QR input
              self.$refs.search_input.focusInput()
            })
            if (res.error === 10) {
              self.Wocode = res.data.Wocode
              self.Batch = res.data.Batch
              self.TotalCount = res.data.TotalCount
              self.CompleteCount = res.data.CompleteCount
              self.MaterialList = res.data.MaterialList
            }
          }
        })
        .catch(res => {
          console.log('res:', res)
          alert('与服务器连接超时,获取失败')
        })
    },

    requestData () {
      let self = this
      self.number += 1
      if (self.StopUpdate === true) {
        return
      }
      let param = new URLSearchParams()
      param.append('token', self.$store.state.token)
      param.append('batch', self.Batch)
      param.append('number', self.number)
      axios({
        method: 'post',
        url: 'api/CheckMaterial/MaterialSearch/LazyLoad/',
        data: param
      })
        .then(res => {
          console.log('success update')
          res = res.data
          if (res.error === 0) {
            console.log(res)
            if (res.data.MaterialList.length < 50) {
              self.StopUpdate = true
            }
            self.MaterialList = self.MaterialList.concat(res.data.MaterialList)
            self.number++
          } else {
            console.log('error != 0')
            let errorInfo = {
              1: '请输入正确的批次号',
              7: '请求失败或无效',
              8: '没有更多内容'
            }
            MessageBox.alert(errorInfo[res.error])
          }
        })
        .catch(res => {
          console.log(res)
          alert('与服务器连接超时,获取失败')
        })
    },

    unlock () {
      this.Wocode = ''
      this.Batch = ''
    }
  },

  components: {
    Search
  }
}
</script>

<style lang="scss" scoped>
  .search {
    position: relative;
    margin: 0 auto;
    width: 98vw;
  }

  .show-numbers {
    position: relative;
    margin: 0 auto;
    width: 94vw;

    div div label {
      font-size: 1.6rem;
    }

    div .form-control {
      font-size: 1.6rem;
    }
  }

  .show-status {
    margin: 0 auto;
    text-align: left;
    width: 98vw;

    .status-left {
      padding: 0 !important;

      .btn-primary {
        font-size: 1.6rem;
      }
    }

    .status-right {
      padding: 0 !important;

      .unlock {
        position: relative;
        float: right;
        font-size: 1.6rem;
        color: #fff;
        background-color: rgb(255, 126, 14);

        &:active {
          color: #000;
          background-color: #e5e5e5;
        }
      }
    }
  }

  .material-list {
    height: calc(100vh - 60vw - 1.5rem);

    .data-list-head {
      width: 100vw;
      display: block;

      .nav {
        padding: 0;
      }

      tr {
        th {
          font-size: 1.5rem;
          font-weight: bold;
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
          padding: 0 !important;

          td {
            font-size: 1.5rem;
          }

          .item-1 {
            text-align: left;
          }

          .item-2 {
            text-align: left;
          }

          .item-3 {
            text-align: center;
          }

          .first-item {
            border-top: none;
          }

          .checkedState {
            background-color: #0c0;
            /*color: #fff;*/
          }
        }

        .content-end {
          width: 100vw;
          height: 1.5rem * 2.5;
        }
      }
    }
  }
</style>
