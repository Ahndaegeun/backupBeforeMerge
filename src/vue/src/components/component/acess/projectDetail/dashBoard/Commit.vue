<template>
  <div class="container">
    <h2>Git Commit</h2>
    <ul class="git-list" v-if="isConnectRepo">
      <li v-for="item in commitList" :key="item">
        <a :href="item.link">- {{item.title}}</a>
      </li>
    </ul>
    <ul class="git-list" v-else>
      <li><a href="/pdtail/gitIssue">Git Repository 주소를 입력해 주세요</a></li>
    </ul>
  </div>  
</template>

<script>
import dotenv from 'dotenv'

dotenv.config()

const API_KEY = process.env.VUE_APP_API_KEY

export default {
  name: "Commit",
  data() {
    return {
      isConnectRepo: false,
      commitList: []
    }
  },
  methods: {
    getFileList() {
      console.log(this.$store.state.dashBoard.gitCommit)
      this.axios.get(`${this.$store.state.dashBoard.gitCommit}`, {
        headers: {
          Authorization: `token ${API_KEY}`
        }
      })
          .then(res => {
            console.log(res)
          })
    },
  },
  mounted() {
    const repo = this.$store.state.dashBoard.gitCommit
    console.log(repo)
    if(repo !== "") {
      this.isConnectRepo = true
      this.getFileList()
    }
  }
}
</script>

<style scoped>
.container {
  height: 340px;
  width: 45%;
  border-radius: 5px;
  background: #2C2F3B;
  padding: 10px;
  color: #ffffff;
}

h2 {
  font-size: 32px;
  margin-bottom: 20px;
}

.git-list {
  padding: 0 20px;
  font-size: 28px;
  height: calc(100% - 52px);
}

.git-list li {
  margin-bottom: 10px;
}

.git-list li:last-child {
  margin-bottom: 0;
}
</style>