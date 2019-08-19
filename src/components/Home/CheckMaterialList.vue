<template>
  <div>
    <div class="table">
      <thead class="nav">
      <tr class="nav col-12 pr-0">
        <th class="col-7" scope="col">物料代码</th>
        <th class="col-5" scope="col">检料状态</th>
      </tr>
      </thead>
      <div class="wrapper nav" ref="wrapper">
        <div class="content col-12 nav pr-0" @click="getBS()">
          <tr class="col-12" v-for="(item, index) in data" :key="index">
            <td class="col-7">{{item}}</td>
            <td class="col-5">@mdo</td>
          </tr>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'CheckMaterialList',

  methods: {
    getBS () {
      console.log(BScroll)
    }
  },

  created () {
    this.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {})
        console.log(this.scroll)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .wrapper {
    height: 32rem;
    overflow: hidden;
  }
</style>
