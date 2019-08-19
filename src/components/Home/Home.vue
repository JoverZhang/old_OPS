<template>
  <div>
    <div class="home-title">
      <button id="btnGroupDrop1"
              class="title-nav-btn dropdown-toggle btn"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">{{username}}
      </button>
      <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
        <a class="dropdown-item" href="#" @click="logout">注销</a>
      </div>
    </div>

    <router-view :material_index="CheckMaterialIndex"/>

    <div class="footer fixed-bottom nav shadow-lg">
      <a class="item col-4"
         :class="{'active':(homeIndex === 'CheckMaterial')}"
         @click="gotoCheckMaterial()">
        检料
      </a>
      <a class="item col-4"
         :class="{'active':(homeIndex === 'Mix')}"
         @click="gotoMix()">
        配置
      </a>
      <a class="item col-4"
         :class="{'active':(homeIndex === 'CheckStorage')}"
         @click="gotoCheckStorage()">
        盘点
      </a>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',

  data () {
    return {
      username: '',
      homeIndex: '',
      CheckMaterialIndex: true
    }
  },

  mounted () {
    let self = this
    self.username = self.$store.state.username
  },

  methods: {
    logout () {
      this.$store.state.username = ''
      this.$store.state.token = ''
      this.$store.state.role = []
      this.$router.push({name: 'Login'})
    },

    gotoCheckMaterial () {
      this.CheckMaterialIndex = !this.CheckMaterialIndex
      this.$router.push({name: 'CheckMaterial'})
    },

    gotoMix () {
      this.CheckMaterialIndex = true
      this.$router.push({name: 'Mix'})
    },

    gotoCheckStorage () {
      this.CheckMaterialIndex = true
      this.$router.push({name: 'CheckStorage'})
    }
  },

  computed: {},

  watch: {
    '$route': function (to, from) {
      console.log(to)
      this.homeIndex = to.name
    }
  }
}
</script>

<style lang="scss" scoped>
  .home-title {
    width: 100vw;
    overflow: hidden;

    #btnGroupDrop1 {
      float: right;
      text-align: center;
      font-size: 1.5rem;
      color: #ff7e0e;
      border: none;
      line-height: 2;
      background-color: #fafafa;
    }

    .dropdown-menu {
      .dropdown-item {
        font-size: 1.4rem;
      }
    }
  }

  .footer {
    .item {
      font-family: '微软雅黑';
      color: #6c757d;
      background-color: white;
      font-size: 1.7rem;
      line-height: 2.5;
      text-decoration: none;

      &:active {
        background-color: rgb(234, 234, 234);
      }
    }

    .active {
      color: rgb(255, 126, 14) !important;
    }
  }
</style>
