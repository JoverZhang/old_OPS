<template>
  <div id="demo">
    <div @click="submit">日期</div>
    <div id="content">123</div>
    <div class="date-panel" v-if="DatePanel">
      <inlineCalendar @change="onChange"/>
      <div @click="submit">submit</div>
    </div>
  </div>
</template>

<script>
import Calendar from 'vue-mobile-calendar'
import Vue from 'vue'

Vue.use(Calendar)
export default {
  name: 'test',

  data () {
    return {
      DatePanel: false,
      DateSelect: ''
    }
  },

  methods: {
    onChange (date) {
      // console.log(date.format('YY-MM-DD'))
      this.DateSelect = date.format('YY-MM-DD')
    },

    submit () {
      console.log(this.DateSelect)
      this.DatePanel = !this.DatePanel
    }
  }

}

</script>

<style lang="scss" scoped>
  // calendar font-size in App
  #content {
    height: 100vh;
    width: 100vw;
    background-color: grey;
  }

  .date-panel {
    width: 100vw;
    position: fixed;
    top: 30vh;
  }
</style>
