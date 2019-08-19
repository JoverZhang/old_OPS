<template>
  <div>
    <div class="notRole" v-if="notRole">
      <div class="role">您还没有访问<br/>该页面的权限</div>
    </div>
    Mix
  </div>
</template>

<script>
export default {
  name: 'Mix',

  data () {
    return {
      notRole: true
    }
  },

  mounted () {
    let self = this
    // Authentication
    let thisRole = '2'
    let username = self.$store.state.username
    let token = self.$store.state.token

    // Not login
    if (!(username && token)) {
      console.log('not token or username')
      self.$router.push({name: 'Login'})
      return
    }

    // Not role
    let role = self.$store.state.role
    if (role.indexOf(thisRole) === -1) {
      console.log('not role')
      self.notRole = true
      return
    }

    // Have role
    console.log('have role')
    self.notRole = false
  }
}
</script>

<style lang="scss" scoped>
  .notRole {
    z-index: 1000;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;

    .role {
      position: relative;
      top: 40vh;
      font-size: 2.5rem;
      color: #fff;
    }
  }
</style>
