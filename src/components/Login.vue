<template>
  <div>
    <div id="bg" :style="{height:topHeight}">
      <div class="title1">Welcome!</div>
      <div class="title2">This is</div>
      <div class="title3">
        <i>PLK-PLC</i>
      </div>
      <div class="title4">
        <div>Login</div>
      </div>
      <div class="form">
        <label for="username" class="mb-0">Username</label>
        <input id="username" class="border-bottom" type="text" v-model="username">
        <label for="password" class="mb-0 mt-2">Password</label>
        <input id="password" class="border-bottom" type="text" v-model="password">
      </div>
      <div class="error" v-if="error1">用户名或密码不正确</div>
      <div class="error" v-if="error2">网络连接超时，请重试</div>
      <div class="error" v-if="error3">请输入用户名和密码</div>
      <div class="submit">
        <div id="submit" @click="sendCommit()">
          <dir class="r">
            <div class="r1"></div>
            <div class="r2"></div>
          </dir>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'vue-router'
import $ from 'jquery'

export default {
  name: 'Login',
  data () {
    return {
      windowHeight: '',
      topHeight: '',

      username: '',
      password: '',
      error1: false,
      error2: false,
      error3: false
    }
  },
  methods: {
    sendCommit () {
      var self = this
      console.log(this.username)
      console.log(this.password)
      this.error1 = false
      this.error2 = false
      this.error3 = false
      if (!(self.username && self.password)) {
        self.error3 = true
        // Test
        self.$router.push({path: '/home/main'})
        return
      }

      $.ajax({
        url: 'login/',
        type: 'GET', // GET
        data: {
          username: this.username,
          password: this.password
        },
        timeout: 5000, // 超时时间
        dataType: 'json', // 返回的数据格式：json/xml/html/script/jsonp/text
        beforeSend: function (xhr) {
          console.log('before')
        },
        success: function (data, textStatus, jqXHR) {
          console.log('success')
          console.log(data.type)
          console.log(data.role)
          if (data.type === 'success') {
            self.$router.push({path: '/home/main'})
          } else {
            self.error1 = true
          }
        },
        error: function (xhr, textStatus) {
          console.log('error')
          self.error2 = true
        }
      })
    }
  },
  mounted () {
    this.windowHeight = window.innerHeight // 浏览器可见区域高度
    this.topHeight = this.windowHeight + 'px' // 浏览器可见区域高度 - 600为背景图高度 / 2 = 平均上下高度
    window.onresize = () => {
      return (() => {
        this.windowHeight = window.innerHeight
        this.topHeight = this.windowHeight + 'px'
      })()
    }
  },
  watch: {
    topHeight (val) {
      this.topHeight = val
    }
  }
}
</script>

<style lang="scss" scoped>
  #bg {
    width: 100%;
    background: url(../assets/img/login.png);
    background-size: cover;

    div {
      position: relative;
      color: white;
    }

    .title1 {
      top: 3rem;
      font-size: 2.2rem;
    }

    .title2 {
      top: 4rem;
      font-size: 1.5rem;
    }

    .title3 {
      top: 4.5rem;
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: 0.3rem;
    }

    .title4 {
      top: 13rem;

      div {
        margin: 0 auto;
        width: 4rem;
        border-top: solid white 0.2rem;
        font-size: 1.2rem;
        font-weight: 900;
      }
    }

    .form {
      top: 16rem;

      * {
        display: block;
      }

      label {
        position: relative;
        left: 5%;
        text-align: left;
        font-size: 1rem;
      }

      input {
        margin: 0 auto;
        width: 90%;
        background-color: rgba(0, 0, 0, 0);
        border: none;
      }
    }

    .error {
      position: fixed;
      font-family: '微软雅黑';
      top: 33.5rem;
      left: 1.5rem;
      color: red;
    }

    .submit {
      top: 22rem;

      #submit {
        margin: 0 auto;
        width: 4.5rem;
        height: 4.5rem;
        background-color: white;
        border-radius: 40px;

        .r {
          div {
            position: relative;
            width: 1rem;
            height: 1rem;
            transform: rotate(45deg);
          }

          .r1 {
            top: 1.8rem;
            left: -1.7rem;
            background-color: green;
            z-index: 0;
          }

          .r2 {
            left: -1.95rem;
            top: 0.8rem;
            // left: -0.25rem;
            background-color: white;
          }
        }

        &:active {
          background-color: #a5a5a5;

          .r2 {
            background-color: #a5a5a5;
          }
        }
      }
    }
  }
</style>
