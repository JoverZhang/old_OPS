<template>
  <div>
    <div class="title-submit">
      <div class="input-group mb-2">
        <div class="input-group-prepend">
          <label for="QR" class="input-group-text" id="basic-addon1">QR</label>
        </div>
        <input onfocus="this.select()" onmouseover="this.focus()" id="QR" type="text" class="form-control"
               placeholder="扫描二维码" v-model="QR" @keyup.enter="sendQR">
      </div>
    </div>
    <div class="StorageContent table">
      <tbody class="col-12" v-if="State">
      <tr>
        <td class="titleName col-6">物料代码：</td>
        <td class="contentName col-6">{{MaterialCode}}</td>
      </tr>
      <tr>
        <td class="titleName col-6">物料名：</td>
        <td class="contentName col-6">{{MaterialName}}</td>
      </tr>
      <tr>
        <td class="titleName col-6">批次：</td>
        <td class="contentName col-6">{{BatchNum}}</td>
      </tr>
      <tr>
        <td class="titleName col-6">状态：</td>
        <td class="contentName col-6">{{StateRender}}</td>
      </tr>
      </tbody>
    </div>
    <div class="wrapper history" ref="wrapper">
      <div class="content nav">
        <tr class="col-12" v-for="(i, index) in History" :key="index">
          <td class="col-4">{{i.UpdateDateTime}}</td>
          <td class="col-2">{{i.UpdateUserName}}</td>
          <td class="col-2">{{i.Loss}}</td>
          <td class="col-2">{{i.UpdateWeight}}</td>
          <td class="col-2">{{i.UpdateState}}</td>
        </tr>
      </div>
    </div>
    <div class="StorageChange table">
      <tbody class="col-12">
      <tr>
        <td class="titleName col-4">状态：</td>
        <td class="contentName col-8">
          <input class="StateInput" v-model="StateInput" type="text">
        </td>
      </tr>
      <tr>
        <td class="titleName col-4">原重量：</td>
        <td class="contentName col-8">{{Iquantity}}</td>
      </tr>
      <tr>
        <td class="titleName col-4">实际重量：</td>
        <td class="contentName col-8">
          <input class="IquantityInput" v-model="IquantityInput" type="text">
          <input class="StorageSubmit" type="button" value="提交" @click="changeWeight">
        </td>
      </tr>
      </tbody>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import axios from 'axios/index'

export default {
  name: 'CheckStorage',
  data () {
    return {
      QR: '',
      MaterialCode: '',
      MaterialName: '',
      BatchNum: '',
      State: '',
      Iquantity: '',
      // History
      History: [],
      StateList: {},
      // Update
      StateInput: '',
      IquantityInput: ''
    }
  },

  computed: {
    StateRender () {
      return this.StateList[this.State].StateName
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
      let self = this
      console.log(self + 'sendQR')
      let param = new URLSearchParams()
      param.append('qrcode', self.QR)
      axios({
        method: 'post',
        // url: 'checkstorage/',
        url: 'api/checkstorage/',
        data: param
      })
        .then(res => {
          console.log('success')
          res = res.data
          console.log(res)
          if (res.error === 0) {
            self.MaterialCode = res.data.MaterialCode
            self.MaterialName = res.data.MaterialName
            self.BatchNum = res.data.BatchNum
            self.State = res.data.State
            self.Iquantity = res.data.Iquantity
            self.History = res.data.History
            self.StateList = self.jsonList2json(res.data.StateList, 'State')
            console.log(self.MaterialCode)
            console.log(self.MaterialName)
            console.log(self.BatchNum)
            console.log(self.State)
            console.log(self.History)
            console.log(self.StateList)
          } else {
            alert('请重新扫描二维码')
          }
        })
        .catch(res => {
          console.log(res)
          alert('与服务器连接超时')
        })
    },

    changeWeight () {
      let self = this
      console.log(self + 'changeWeight')

      let param = new URLSearchParams()
      param.append('qrcode', self.QR)
      param.append('iquantity', self.IquantityInput)
      param.append('state', self.StateInput)
      axios({
        method: 'post',
        url: 'api/checkstorageupdate/',
        // url: 'checkstorageupdate/',
        data: param
      })
        .then(res => {
          console.log('success')
          res = res.data
          console.log(res)
          if (res.error === 0) {
            self.Iquantity = res.data.Iquantity
            self.State = res.data.State
            console.log(self.State)
            console.log(self.Iquantity)
          } else {
            alert('请重新提交')
          }
        })
        .catch(res => {
          console.log(res)
          alert('与服务器连接超时')
        })
    }
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
          scrollY: true
          // pullUpLoad: {
          //   threshold: -50 // 当上拉距离超过20px时触发 pullingUp 事件
          // }
        })
        // this.scroll.on('pullingUp', () => {
        //   this.requestData()
        //   this.scroll.finishPullUp() // 事情做完，需要调用此方法告诉 better-scroll 数据已加载，否则下拉事件只会执行一次
        // })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  input-group {
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

  .StorageContent {
    tbody {
      display: block;

      tr {
        display: flex;
        font-size: 2rem;

        .titleName {
          text-align: right;
        }

        .contentName {
          text-align: left;
        }
      }
    }
  }

  .history {
    height: 30vw;
    width: 100vw;
    overflow: hidden;

    .content {
      height: auto;
      width: 100vw;

      tr {
        display: flex;

        td {
          font-size: 1.6rem;
        }
      }
    }
  }

  .StorageChange {
    tbody {
      display: block;

      tr {
        display: flex;
        font-size: 2rem;

        .titleName {
          text-align: right;
        }

        .contentName {
          text-align: left;

          .StorageInput {
            width: 35vw;
          }

          .StorageSubmit {
            width: 15vw;
          }
        }
      }
    }
  }
</style>
