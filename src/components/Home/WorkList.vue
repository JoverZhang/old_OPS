<template>
  <div>
    <div class="float_button">
      <router-link class="toWorkList" :to="{name: 'CheckMaterial'}">&lt;</router-link>
    </div>
    <div class="data-list table">
      <thead class="data-list-head">
      <tr class="nav pr-0">
        <th class="col-6" scope="col">工单代码</th>
        <th class="col-6" scope="col">工单状态</th>
      </tr>
      </thead>
      <div class="wrapper nav" ref="wrapper" v-if="StateList">
        <div class="content col-12 nav pr-0">
          <tr class="col-12 itemPoP" v-for="(item, index) in dataList" :key="index"
              @click="popWindows(index)">
            <td :class="{'first-item':(index === 0)}"
                class="col-8">{{item.Wocode}}
            </td>
            <td :class="{'first-item':(index === 0)}"
                class="col-4">{{StateRender(item.Wocodestate)}}
            </td>
          </tr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import BScroll from 'better-scroll'
import axios from 'axios'

export default {
  name: 'WorkList',

  data () {
    return {
      // 数据列表
      dataList: [],
      StateList: []
    }
  },

  mounted () {
    this.getData()
  },

  computed: {
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

    getData () {
      let self = this
      let param = new URLSearchParams()
      axios({
        method: 'post',
        // url: 'checkMaterial_2/',
        url: 'api/checkMaterial_2/',
        data: param
      })
        .then(res => {
          console.log('success')
          res = res.data
          if (res.error === 0) {
            console.log(res)
            self.dataList = res.data.WoList
            self.StateList = self.jsonList2json(res.data.StateList, 'State')
          } else {
            alert('获取失败')
          }
        })
        .catch(res => {
          console.log(res)
          alert('与服务器连接超时')
        })
    },

    popWindows (index) {
      alert(
        '批次号：' + (this.dataList[index].Batch).toString() +
        '\n批次状态：' + this.StateList[this.dataList[index].batchstate].StateName
      )
    }
  },

  created () {
    this.$nextTick(() => {
      if (!this.scroll) {
        // this.scroll = new BScroll(this.$refs.wrapper, {})
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: true,
          taps: true,
          bounce: false,
          scrollbar: true,
          preventDefault: false,
          scrollY: true,
          tap: true,
          mouseWheel: true
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
    left: 5%;
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

  .data-list {
    /*height: auto;*/
    height: calc(100vh - 20vw - 1.5rem);

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
      height: calc(100vh - 30vw);
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
        }
      }
    }
  }

  .content {
    height: calc(17 * 100px);
  }
</style>
