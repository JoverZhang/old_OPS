<template>
  <div>
    <div class="title-nav mb-1">
      <button id="btnGroupDrop1" type="button" class="title-nav-btn dropdown-toggle" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
        UserName
      </button>
      <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
        <a class="dropdown-item" href="#">注销</a>
      </div>
    </div>

    <router-view/>
    <div class="footer fixed-bottom nav shadow-lg">
      <router-link
        class="item col-4"
        :class="{'active':(homeIndex === 0)}"
        :to="{name: 'CheckMaterial'}"
        @click.native="changeHomeIndex(0)"
      >检料
      </router-link>
      <router-link
        class="item col-4"
        :class="{'active':(homeIndex === 1)}"
        :to="{name: 'Mix'}"
        @click.native="changeHomeIndex(1)"
      >配置
      </router-link>
      <router-link
        class="item col-4"
        :class="{'active':(homeIndex === 2)}"
        :to="{name: 'CheckStorage'}"
        @click.native="changeHomeIndex(2)"
      >盘点
      </router-link>
    </div>
  </div>
</template>

<script>
import store from '@/store/index'

export default {
  name: 'Home',
  store,
  data () {
    return {}
  },
  methods: {
    changeHomeIndex (value) {
      store.commit('changeHomeIndex', value)
    }
  },
  computed: {
    homeIndex () {
      return store.state.homeIndex
    }
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
  .title-nav {
    width: 100vw;
    height: 7vw;
    text-align: left;

    .title-nav-btn {
      font-size: 4vw;
      line-height: 7vw;
      border: none;
      background-color: white;
      display: inline;
    }
  }

  .footer {
    .item {
      font-family: '微软雅黑';
      color: #6c757d;
      background-color: white;
      font-size: 1.7rem;
      line-height: 13vw;
      height: 13vw;

      &:active {
        background-color: rgb(234, 234, 234);
      }
    }

    .active {
      color: rgb(255, 126, 14);
      text-decoration: none;
    }
  }
</style>
