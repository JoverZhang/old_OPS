<template>
  <div class="page-infinite-wrapper">
    <!--       ref="wrapper" :style="{ height: wrapperHeight + 'px' }">-->
    <ul class="page-infinite-list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="1">
      <li v-for="(item,key) in wo_list" class="page-infinite-listitem" :key="key">
        批次号：{{ item.Batch }} / 批次状态：{{item.BatchState}} / 工单号：{{item.Wocode}}
      </li>
    </ul>
    <p v-show="loading" class="page-infinite-loading">
      <!--      <mt-spinner type="fading-circle"></mt-spinner>-->
      加载中...
    </p>
    <div style="height: 13vw;"></div>
  </div>
</template>

<style lang="scss">
  .page-infinite-listitem {
    font-size: 1.5rem;
  }
</style>

<script type="text/babel">
export default {
  data () {
    return {
      list: [],
      loading: false,
      allLoaded: false,
      wrapperHeight: 0
    }
  },

  props: ['wo_list'],

  methods: {
    loadMore () {
      this.loading = true
      setTimeout(() => {
        let last = this.list[this.list.length - 1]
        for (let i = 1; i <= 10; i++) {
          this.list.push(last + i)
        }
        this.loading = false
      }, 2500)
    }
  },

  mounted () {
    // console.log(document.documentElement.clientHeight)
    // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top
    for (let i = 1; i <= 50; i++) {
      this.list.push(i)
    }
  }
}
</script>
