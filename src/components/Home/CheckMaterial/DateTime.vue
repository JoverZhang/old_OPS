<template>
  <div class="page-datetime">
    <div class="page-datetime-wrapper">
      <div class="select-date">
        <button type="button" class="btn btn-primary" @click="selectData">{{dateValFormat}}</button>
      </div>
    </div>
    <mt-datetime-picker
      ref="picker2"
      type="date"
      v-model="dateVal"
      :start-date="startDate"
      :end-date="endDate"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleChange">
    </mt-datetime-picker>
  </div>
</template>

<style lang="scss">
  .select-date {
    overflow: hidden;

    .btn {
      float: left;
      display: block;
      line-height: 1.5;
      font-size: 1.5rem;
    }
  }

  .mint-datetime-picker {
    .picker-items {
      .picker-slot {
        .picker-slot-wrapper {
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
</style>

<script type="text/babel">
// import {Toast} from 'mint-ui'

export default {
  data () {
    return {
      dateVal: new Date(),
      selectedValue: new Date(),
      startDate: new Date(),
      endDate: new Date()
    }
  },
  computed: {
    year () {
      return this.selectedValue.getFullYear()
    },
    month () {
      return this.selectedValue.getMonth() + 1
    },
    day () {
      return this.selectedValue.getDate()
    },
    dateValFormat () {
      return this.year + '年-' + this.month + '月-' + this.day + '日'
    }
  },
  methods: {
    handleChange (value) {
      this.selectedValue = this.dateVal
      this.$emit('screen')
    },
    selectData () { // 打开时间选择器
      // 如果已经选过日期，则再次打开时间选择器时，日期回显（不需要回显的话可以去掉 这个判断）
      this.$refs['picker2'].open()
    }
  },
  mounted () {
    // 初始化日期
    if (this.selectedValue) {
      this.dateVal = this.selectedValue
    } else {
      this.dateVal = new Date()
      this.selectedValue = this.dateVal
    }
    this.startDate.setDate(this.selectedValue.getDate() - 366)
    this.endDate.setDate(this.selectedValue.getDate() + 366)
  }
}
</script>
