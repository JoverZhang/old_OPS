<template>
  <div>
    <mt-popup v-model="popupVisible" position="top" style="border-radius: 10px" class="mint-popup-4">
      <div class="history table">
        <div class="wrapper" ref="wrapper">
          <div class="content nav">
            <tr v-for="(item, index) in renderDataList" :key="index">
              <td
                class="item-1 col-8"><span>修改时间：</span><br/>{{item.UpdateDateTime}}
              </td>
              <td
                class="item-2 col-4"><span>修改者：</span><br/>{{item.UpdateUserName}}
              </td>
              <td
                class="item-3 col-4"><span>误差：</span><br/>{{item.Loss}}kg
              </td>
              <td
                class="item-4 col-4"><span>修改重量：</span><br/>{{item.UpdateWeight}}kg
              </td>
              <td
                class="item-5 col-4"><span>修改状态：</span><br/>{{item.UpdateState}}
              </td>
            </tr>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'History',

  props: ['dataList'],

  data () {
    return {
      popupVisible: false,
      renderDataList: []
    }
  },

  mounted () {
    // BScroll
    this.number = 0
    this.$nextTick(() => {
      if (!this.scroll) {
        // this.scroll = new BScroll(this.$refs.wrapper, {})
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: true,
          preventDefault: false,
          tap: true,
          mouseWheel: true,
          scrollY: true
        })
      }
    })
  },

  watch: {
    dataList (val) {
      this.renderDataList = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .history {
    width: 80vw;
    overflow: hidden;

    .data-list-head {
      tr {
        position: relative;
        width: 80vw;

        th {
          font-size: 1.4rem;
        }
      }
    }

    .wrapper {
      max-height: 80vh;

      .content {
        tr {
          display: flex;
          flex-wrap: wrap;
          border: none;
          border-bottom: 1px solid #007bff;

          td {
            border: none;

            span {
              color: grey;
            }
          }

          .item-3,
          .item-4,
          .item-5 {
            border-top: 1px solid #dee2e6 !important;
          }
        }
      }
    }
  }
</style>
