<template>
  <div>
    <div class="login-bg">
      <img src="../assets/img/login_img.jpeg" alt="">
    </div>
    <div class="login-form">
      <div class="username mb-3">
        <label for="username">账号：</label>
        <input id="username" class="border-bottom" type="text" v-model="username">
      </div>
      <div class="password">
        <label for="password">密码：</label>
        <input id="password" class="border-bottom" type="text" v-model="password">
      </div>
      <div class="error" v-if="error1">用户名或密码不正确</div>
      <div class="error" v-if="error2">网络连接超时，请重试</div>
      <div class="error" v-if="error3">请输入用户名和密码</div>
      <div class="icon-arrow_right mt-4" @click="sendCommit"></div>
    </div>

  </div>
</template>

<script>
import 'vue-router'
import axios from 'axios'

export default {
  name: 'Login',

  data () {
    return {

      username: '',
      password: '',
      // 用户名或密码不正确
      error1: false,
      // 网络连接超时
      error2: false,
      // 请输入用户名和密码
      error3: false
    }
  },

  methods: {
    sendCommit () {
      let self = this
      this.error1 = false
      this.error2 = false
      this.error3 = false
      if (!(self.username && self.password)) {
        self.error3 = true
        // Test
        return
      }
      let param = new URLSearchParams()
      console.log(self.username)
      console.log(self.password)
      param.append('username', self.username)
      param.append('password', self.password)
      axios({
        method: 'post',
        url: 'api/login/',
        data: param
      })
        .then(res => {
          console.log('success')
          console.log(res)
          res = res.data
          if (res.error === 0) {
            console.log(res.data)
            self.$store.commit('setUsername', res.data.Username)
            self.$store.commit('setToken', res.data.Token)
            self.$store.commit('setRole', (res.data.Role).split(','))
            console.log(self.$store.state.username)
            console.log(self.$store.state.token)
            console.log(self.$store.state.role)
            self.$router.push({path: '/home/main'})
          } else {
            self.error1 = true
          }
        })
        .catch(res => {
          console.log('error')
          self.error2 = true
        })
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/fonts.css";

  .login-bg {
    position: absolute;

    img {
      width: 100vw;
      height: 100vh;
    }
  }

  .login-form {
    position: relative;
    padding-top: 45vh;
    width: 100vw;

    .username,
    .password {
      padding: 0 10vw;
      width: 100vw;
      display: flex;
      flex-direction: column;

      label {
        text-align: left;
        font-size: 1.8rem;
        color: #2c3e50;
      }

      input {
        background-color: rgba(0, 0, 0, 0);
        font-size: 1.8rem;
        border: none;
      }

      #username,
      #password {
        border-bottom: 1px solid grey !important;
      }
    }

    .error {
      position: relative;
      color: red;
    }

    .icon-arrow_right {
      display: inline-block;
      font-size: 6rem;
      background-color: #ced4da;
      border-radius: 40px;

      &:active {
        background-color: white;
      }
    }
  }
</style>
