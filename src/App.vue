<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view id="login"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  * {
    font-size: 62%;
  }

  html,
  body {
    /*height: 100%;*/
    width: 100%;
    border: hidden;
    overflow: hidden;
  }

  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    /*height: 100%;*/
    // margin-top: 60px;
    #login {
      width: 100%;
      /*height: 100%;*/
    }
  }
</style>
