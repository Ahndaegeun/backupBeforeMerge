<template>
  <div class="container">
    <div class="read-me-top-wrap">
      <h2>README.md</h2>
      <button class="save-readme-btn" @click="saveReadMe">save</button>
    </div>
    <v-md-editor v-model="this.$store.state.dashBoard.readMeContent"
                 @change="updateReadMe"
                  height="480px"/>
  </div>
</template>

<script>
import {mapActions, mapMutations} from "vuex";

export default {
  name: "readme",
  data() {
    return {
      isMount: false
    }
  },
  methods: {
    ...mapActions({
      saveReadMe: 'dashBoard/saveReadMe',
    }),
    ...mapMutations({
      setReadMeContent: 'dashBoard/setReadMeContent'
    }),
    updateReadMe(origin) {
      if(this.isMount) {
        this.setReadMeContent(origin)
      }
    }
  },
  mounted() {
    this.isMount = true
  },
  unmounted() {
    this.isMount = false
  }
}
</script>

<style scoped>
.container {
  border-radius: 5px;
  background: #2C2F3B;
  padding: 20px;
  color: #ffffff;
}

h2 {
  font-size: 32px;
}

h2 span {
  font-size: 24px;
}

.read-me-top-wrap {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.save-readme-btn {
  color: #999;
  transition: color .2s ease-in;
}

.save-readme-btn:hover {
  color: #fff;
}
</style>