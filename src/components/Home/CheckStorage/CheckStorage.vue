<template>
  <div>
    <div class="notRole" v-if="notRole">
      <div class="role">您还没有访问<br/>该页面的权限</div>
    </div>
    <History ref="history" :dataList="History"></History>
    <Search class="search mb-2" @search="search"/>
    <div class="content-view mb-2">
      <div class="input-group">
        <div class="input-group-prepend">
          <label class="input-group-text">物料代码:</label>
        </div>
        <div class="form-control">{{MaterialCode}}</div>
      </div>

      <div class="input-group">
        <div class="input-group-prepend">
          <label class="input-group-text">物料名称: </label>
        </div>
        <div class="form-control">{{MaterialName}}</div>
      </div>

      <div class="input-group">
        <div class="input-group-prepend">
          <label class="input-group-text">批次号码: </label>
        </div>
        <div class="form-control">{{BatchNum}}</div>
      </div>

      <div class="input-group">
        <div class="input-group-prepend">
          <label class="input-group-text">物料状态: </label>
        </div>
        <div class="form-control">{{State?StateRender:''}}</div>
      </div>
    </div>

    <div class="StorageChange nav">
      <button class="col-3 btn btn-primary"
              :class="{'btn-secondary':(choiceState !== '21')}"
              @click="changeState('21')">
        正常
      </button>
      <button class="col-3 btn btn-primary"
              :class="{'btn-secondary':(choiceState !== '22')}"
              @click="changeState('22')">
        变质
      </button>
      <button class="col-3 btn btn-primary"
              :class="{'btn-secondary':(choiceState !== '23')}"
              @click="changeState('23')">
        过期
      </button>
      <button class="col-3 btn btn-primary"
              :class="{'btn-secondary':(choiceState !== '24')}"
              @click="changeState('24')">
        作废
      </button>

      <div class="input-group">
        <div class="input-group-prepend">
          <label class="input-group-text">原本重量: </label>
        </div>
        <div class="form-control">{{Iquantity}}{{Iquantity?'kg':''}}</div>
      </div>

      <div class="input-group">
        <div class="input-group-prepend mb-2">
          <label for="weight" class="input-group-text" id="basic-addon1">实际重量: </label>
        </div>
        <input id="weight"
               class="form-control"
               type="text"
               style="text-align: center"
               placeholder="输入实际重量"
               v-model="IquantityInput"
               @keyup.enter="changeWeight">
      </div>
      <div class="history-and-submit">
        <button class="btn-left btn btn-primary" @click="popHistoryWindow">
          历史记录
        </button>
        <button class="btn-right btn btn-primary" @click="changeWeight">
          提交修改
        </button>
      </div>
    </div>
    <div class="content-end"></div>
  </div>
</template>

<script>
// import BScroll from 'better-scroll'
import axios from 'axios/index'
import Search from '../CheckMaterial/Search'
import History from './History'
import {MessageBox} from 'mint-ui'

export default {
  name: 'CheckStorage',

  data () {
    return {
      // send
      QR: '',

      // receive
      // normal
      MaterialCode: '',
      MaterialName: '',
      BatchNum: '',
      State: '',
      Iquantity: '',
      notRole: true,
      // History
      popupHistory: false,
      History: [],
      StateList: {},
      // Update
      choiceState: '',
      IquantityInput: ''
    }
  },

  computed: {
    StateRender () {
      return this.StateList[this.State].StateName
    }
  },

  mounted () {
    let self = this
    // Authentication
    let thisRole = '3'
    let username = self.$store.state.username
    let token = self.$store.state.token

    // Not login
    if (!(username && token)) {
      console.log('not token or username')
      self.$router.push({name: 'Login'})
      return
    }

    // Not role
    let role = self.$store.state.role
    if (role.indexOf(thisRole) === -1) {
      console.log('not role')
      self.notRole = true
      return
    }

    // Have role
    console.log('have role')
    self.notRole = false

    // Bundle QR input
    this.$nextTick(() => {
      document.getElementById('QR').focus()
    })
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

    search (QR) {
      let self = this
      self.QR = QR
      console.log(self + 'sendQR')
      let param = new URLSearchParams()
      param.append('token', self.$store.state.token)
      param.append('qrcode', QR)
      axios({
        method: 'post',
        url: 'api/CheckStorage/',
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
            self.choiceState = self.State
            console.log(self.choiceState)
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
            // alert('请重新扫描二维码')
            let errorInfo = {
              2: '请收入正确的二维码',
              3: '不是原料二维码',
              4: '未找到有效内容'
            }
            MessageBox.alert(errorInfo[res.error])
          }
        })
        .catch(res => {
          console.log(res)
          alert('与服务器连接超时')
        })
    },

    changeState (state) {
      let self = this
      self.choiceState = state
    },

    changeWeight () {
      let self = this
      console.log(self + 'changeWeight')

      let param = new URLSearchParams()
      param.append('token', self.$store.state.token)
      param.append('qrcode', self.QR)
      param.append('iquantity', self.IquantityInput)
      param.append('state', self.choiceState)
      axios({
        method: 'post',
        url: 'api/CheckStorage/Change/',
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
            // alert('请重新提交')
            let errorInfo = {
              2: '请收入正确的二维码',
              3: '不是原料二维码',
              4: '未找到有效内容'
            }
            MessageBox.alert(errorInfo[res.error])
          }
        })
        .catch(res => {
          console.log(res)
          alert('与服务器连接超时')
        })
    },
    popHistoryWindow () {
      this.$refs.history.popupVisible = true
    }
  },

  components: {
    Search,
    History
  }
}
</script>

<style lang="scss" scoped>
  .notRole {
    z-index: 1000;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;

    .role {
      position: relative;
      top: 40vh;
      font-size: 2.5rem;
      color: #fff;
    }
  }

  .search {
    position: relative;
    margin: 0 auto;
    width: 98vw;
  }

  .content-view {
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

  .StorageChange {
    margin: 0 auto;
    width: 94vw;

    .btn {
      font-size: 1.6rem;
    }

    div div label {
      font-size: 1.6rem;
    }

    div .form-control {
      font-size: 1.6rem;
    }

    .history-and-submit {
      width: 100%;
      display: flex;
      justify-content: space-around;

      .btn-left {
        width: 50%;
        margin-right: 2.5%;
      }

      .btn-right {
        margin-left: 2.5%;
        width: 50%;
      }
    }
  }

  .content-end {
    width: 100vw;
    height: 1.5rem * 2.5;
  }
</style>
