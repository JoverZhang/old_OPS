<template>
  <div>
    <div class="notRole" v-if="notRole">
      <div class="role">您还没有访问<br/>该页面的权限</div>
    </div>

    <MaterialList v-if="goMaterialList" :sendBatch="sendBatch" :stateList="StateList"/>

    <div v-if="!goMaterialList">
      <Search class="search mb-2" @search="search"/>
      <div class="titleList mb-2 nav">
        <v-DateTime class="title-left col-8"
                    @screen="screen"
                    ref="DateTime"/>
        <v-StatePopup class="title-right col-4"
                      :state_list="StateList"
                      :state_just_name_list="StateJustNameList"
                      @screen="screen"
                      ref="StateScreen"/>
      </div>
      <transition name="fade">
        <mt-popup
          v-if="popupVisible===true"
          style="border-radius: 10px;"
          v-model="popupVisible"
        >
          <div class="batch-item-pop">

            <div class="batch-state bg-primary">{{StateRender(WoList[popIndex].BatchState)}}</div>

            <div class="wocode input-group mt-3">
              <div class="input-group-prepend">
                <label class="input-group-text">工单号：</label>
              </div>
              <div class="content" v-text="WoList[popIndex].Wocode"></div>
            </div>

            <!--          <hr class="mt-2 mb-2"/>-->

            <div class="batch input-group">
              <div class="input-group-prepend">
                <label class="input-group-text">批次号：</label>
              </div>

              <div class="content" v-text="WoList[popIndex].Batch"></div>
            </div>

            <div class="btn-list pt-2">
              <button class="btn btn-primary mr-1"
                      @click="gotoMaterialList"
              >锁定
              </button>
              <button class="btn btn-secondary ml-1"
                      @click="popupVisible=false">取消
              </button>
            </div>

          </div>
        </mt-popup>
      </transition>
      <table class="batch-table table table-striped table-hover">
        <thead>
        <tr class="nav batch-table-title">
          <th class="col-1" scope="col">#</th>
          <th class="col-8" scope="col">批次号</th>
          <th class="col-3" scope="col">批次状态</th>
        </tr>
        </thead>
        <tbody>
        <div v-if="WoList.length <= 0" class="pt-4" style="color:#999; font-size: 1.5rem">今天没有生产任务</div>
        <tr class="batch-table-content nav"
            v-for="(item, index) in WoList" :key="index"
            @click="popDetail(index)">
          <th class="col-1 item-1" scope="row">{{index + 1}}</th>
          <td class="col-8 item-2">{{item.Batch}}</td>
          <td class="col-3 item-3"
              :class="{'checkedState':(item.BatchState == 3)}">
            <!--use === has bug-->
            {{StateRender(item.BatchState)}}
          </td>
        </tr>
        </tbody>
        <div class="content-end"></div>
      </table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

import Search from './Search'
// import InfiniteScroll from '../../Infinite-Scroll'
import DateTime from './DateTime'
import StatePopup from './Popup'
import MaterialList from './MaterialList'

import {Popup, MessageBox} from 'mint-ui'

Vue.component(Popup.name, Popup)

export default {
  name: 'CheckMaterial',

  props: ['material_index'],

  components: {
    Search,
    'v-DateTime': DateTime,
    // 'v-Infinite_Scroll': InfiniteScroll,
    'v-StatePopup': StatePopup,
    MaterialList
  },

  data () {
    return {
      // send
      sendBatch: '',

      // receive
      WoList: [],
      popIndex: -1,
      StateNameList: [],
      StateList: [],
      // normal
      goMaterialList: false,
      popupVisible: false,
      notRole: true
    }
  },

  computed: {
    StateJustNameList () {
      let justNameList = []
      for (let i in this.StateList) {
        justNameList.push(this.StateList[i].StateName)
      }
      return justNameList
    },

    StateRender (n) {
      return function (n) {
        return (this.StateList[n].StateName)
      }
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

    popDetail (index) {
      this.popupVisible = true
      console.log(index)
      this.popIndex = index
      this.sendBatch = this.WoList[index].Batch
    },

    search (QR) {
      let self = this
      let param = new URLSearchParams()
      param.append('token', self.$store.state.token)
      param.append('batch', QR)
      axios({
        method: 'post',
        url: 'api/CheckMaterial/search/',
        data: param
      })
        .then(res => {
          res = res.data
          if (res.error === 0) {
            console.log('%c' + 'search success', 'color:#f00')
            self.WoList = res.data.WoList
            console.log('self.WoList:', self.WoList)
          } else {
            self.WoList = []
            console.log('%c' + 'error != 0', 'color:#f00')
            let errorInfo = {
              2: '该批次未找到有效内容',
              3: '请输入正确的批次号'
            }
            MessageBox.alert(errorInfo[res.error])
          }
        })
        .catch(res => {
          console.log('res:', res)
          alert('与服务器连接超时,获取失败')
        })
    },

    screen () {
      let self = this
      let param = new URLSearchParams()
      param.append('token', self.$store.state.token)
      param.append('date', self.$refs.DateTime.selectedValue)
      param.append('batch_state', self.StateNameList[self.$refs.StateScreen.selectState].State)
      axios({
        method: 'post',
        url: 'api/CheckMaterial/screen/',
        data: param
      })
        .then(res => {
          res = res.data
          if (res.error === 0) {
            console.log('%c' + 'screen success', 'color:#f00')
            self.WoList = res.data.WoList
            console.log('self.WoList:', self.WoList)
          } else {
            self.WoList = []
            console.log('%c' + 'error != 0', 'color:#f00')
            let errorInfo = {
              6: '该日期和状态未找到有效内容'
            }
            MessageBox.alert(errorInfo[res.error])
          }
        })
        .catch(res => {
          console.log('res:', res)
          alert('与服务器连接超时,获取失败')
        })
    },
    gotoMaterialList () {
      this.goMaterialList = true
      this.popupVisible = false
    }
  },

  mounted () {
    let self = this
    // Authentication
    let thisRole = '1'
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

    // Init Query
    let param = new URLSearchParams()
    param.append('token', token)
    axios({
      method: 'post',
      url: 'api/CheckMaterial/',
      data: param
    })
      .then(res => {
        res = res.data
        if (res.error === 0) {
          console.log('res:', res)
          self.WoList = res.data.WoList
          self.StateList = self.jsonList2json(res.data.StateList, 'State')
          self.StateNameList = self.jsonList2json(res.data.StateList, 'StateName')
          console.log('self.WoList:', self.WoList)
          console.log('self.StateList:', self.StateList)
          console.log('self.StateNameList:', self.StateNameList)
          if (!self.WoList) {
            console.log('null')
          }
        } else {
          console.log('%c' + 'error != 0', 'color:#f00')
          let errorInfo = {
            1: '请输入正确的批次号'
          }
          MessageBox.alert(errorInfo[res.error])
        }
      })
      .catch(res => {
        console.log('res:', res)
        alert('与服务器连接超时,获取失败')
      })
    console.log(this.material_index)
  },

  watch: {
    material_index (val) {
      // watch index for home
      this.goMaterialList = val
      console.log(val)
    }
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

  .titleList {
    position: relative;
    margin: 0 auto;
    width: 98vw;
    overflow: hidden;

    .title-left {
      padding: 0 !important;
      /*width: 70vw;*/
      float: left;
    }

    .title-right {
      padding: 0 !important;
      /*width: 30vw;*/
      float: right;
    }
  }

  .batch-table {
    .batch-table-title {
      font-size: 2.5rem;
      width: 100vw;
    }

    .batch-table-content {
      width: 100vw;
      font-size: 3rem;

      .item-1 {
        text-align: center;
      }

      .item-2 {
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item-3 {
        text-align: center;
      }

      .checkedState {
        background-color: #0c0;
        /*color: #fff;*/
      }
    }
  }

  .batch-item-pop {
    width: 90vw;
    padding: 1rem 5vw 5vw 5vw;

    .wocode, .batch {
      div label {
        font-size: 1.5rem;
        line-height: 1.5;
      }

      .content {
        font-family: arial, 'Microsoft Yahei', '微软雅黑';
        display: block;

        font-size: 2rem;
        line-height: 1.5;
        text-align: left;

        white-space: normal;
        word-break: break-all;
        word-wrap: break-word;
        padding-left: .5rem;
        padding-right: .5rem;
      }
    }

    .batch-state {
      border-radius: 3px;
      font-size: 1.5rem;
      line-height: 2;
      color: #fff;
    }

    .btn-list .btn {
      font-size: 1.7rem;
    }
  }

  .content-end {
    width: 100vw;
    height: 1.5rem * 2.5;
  }

  .fade-enter,
  .fade-leave-to {
    /*transform-origin: top;*/
    /*animation: bounce-in 1s;*/
    /*transform: scale(0);*/
    opacity: 0;
    transition: opacity .5s;
  }

  .fade-enter-active,
  .fade-leave-active {
    /*opacity: 0;*/
    /*transition: opacity 1s;*/
  }
</style>
