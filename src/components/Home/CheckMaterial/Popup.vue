<template>
  <div class="page-popup">
    <div id="select_state" hidden>{{selectState}}</div>
    <div class="page-popup-wrapper">
      <div class="screen">
        <button class="btn btn-primary" @click="popupVisible4 = true">{{selectState}}</button>
      </div>
    </div>
    <mt-popup v-model="popupVisible4" position="bottom" class="mint-popup-4 pop-window check-material-state-list-pop">
      <div class="picker-toolbar" style="border-bottom: 1px solid #eaeaea;">
        <span class="mint-datetime-action mint-datetime-cancel" @click="popCancel">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="popSubmit">确定</span>
      </div>
      <mt-picker
        :slots="dateSlots"
        @change="onDateChange"
        :visible-item-count="5"
        :show-toolbar="false">
      </mt-picker>
    </mt-popup>
  </div>
</template>

<style lang="scss">
  .check-material-state-list-pop {
    .picker {
      .picker-items {
        .picker-slot {
          .picker-item {
            font-size: 1.3rem;
          }

          .picker-selected {
            font-size: 2rem;
            background-color: #398bfb;
            color: #fff;
          }
        }
      }
    }
  }

  .screen {
    overflow: hidden;

    .btn {
      float: right;
      display: block;
      line-height: 1.5;
      font-size: 1.5rem;
    }
  }

  .pop-window {
    width: 100vw;
  }
</style>

<script type="text/babel">

export default {
  data () {
    return {
      popupVisible4: false,
      buttonBottom: 0,
      selectState: '已配料',
      selectStateCache: '已配料'
    }
  },

  props: ['state_list', 'state_just_name_list'],

  computed: {
    dateSlots () {
      return [
        {
          flex: 1,
          values: this.state_just_name_list
        }
      ]
    }
  },

  methods: {
    onDateChange (picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
      this.selectStateCache = values[0]
    },

    popSubmit () {
      this.popupVisible4 = false
      this.selectState = this.selectStateCache
      this.$emit('screen')
    },

    popCancel () {
      this.popupVisible4 = false
    }
  },

  mounted () {
  }
}
</script>
