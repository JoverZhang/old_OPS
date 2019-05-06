<template>
  <div>
    <div class="float_button">
      <router-link class="toWorkList" :to="{name: 'CheckMaterial'}">&lt;</router-link>
    </div>
    <div class="data-list table">
      <thead class="data-list-head">
      <tr class="nav pr-0">
        <th class="col-6" scope="col">物料代码</th>
        <th class="col-6" scope="col">检料状态</th>
      </tr>
      </thead>
      <div class="wrapper nav" ref="wrapper">
        <div class="content col-12 nav pr-0">
          <tr class="col-12 itemPoP" v-for="(item, index) in dataList" :key="index"
              @click="popWindows(index)">
            <td :class="{'first-item':(index === 0)}"
                class="col-8">{{item.Wocode}}
            </td>
            <td :class="{'first-item':(index === 0)}"
                class="col-4">{{item.Wocodestate}}
            </td>
          </tr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store/index'
import $ from 'jquery'
import BScroll from 'better-scroll'

export default {
  name: 'WorkList',
  store,
  data () {
    return {
      // 数据列表
      dataList: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      var self = this
      $.ajax({
        url: 'checkMaterial_2/',
        type: 'POST',
        data: {
          type: 'normal'
        },
        timeout: 5000,
        dataType: 'json',
        success: function (data) {
          console.log('success')
          if (data.Type === 'success') {
            self.dataList = data.Page2List
          } else {
            alert('与服务器连接中断')
          }
        },
        error: function (data) {
          console.log('timeout')
          alert('与服务器连接超时')
          console.log(data)
          self.dataList = store.state.Page2List
          self.wocode = store.state.wocode
          self.batch = store.state.batch
          self.total = store.state.total
          self.completed = store.state.completed
        }
      })
    },
    popWindows (index) {
      // alert((this.dataList[index].Batch).toString() + ', ' + (this.dataList[index].batchstate).toString())
      alert(this.dataList[index].Batch)
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
