<template>
  <div>
    <div class="input-group">
      <div class="input-group-prepend">
        <label for="QR" class="input-group-text" id="basic-addon1">QR</label>
      </div>
      <input id="QR"
             class="form-control"
             type="text"
             placeholder="扫描二维码"
             onmouseover="this.focus()"
             onfocus="this.select()"
             v-model="QR"
             :style="{'background-color':inputColor}"
             @keyup.enter="search">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',

  props: [
    'inputColor'
  ],

  data () {
    return {
      QR: ''
    }
  },

  methods: {
    search () {
      this.$emit('search', this.QR)
      document.getElementById('QR').select()
    },

    focusInput () {
      document.getElementById('QR').focus()
      console.log('focus')
    }
  }
}
</script>

<style lang="scss" scoped>
  .input-group {
    .input-group-prepend {
      label {
        font-size: 1.6rem;
      }
    }

    #QR {
      font-size: 1.6rem;
    }
  }
</style>
