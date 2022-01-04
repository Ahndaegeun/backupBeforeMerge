<template>
  <div class="container">
    <h2>Git Commit</h2>
    <ul class="git-list" v-if="this.$store.state.dashBoard.gitCommit !== '' && this.$store.state.dashBoard.gitCommit !== null">
      <li v-for="item in this.$store.state.dashBoard.commitList" :key="item">
        <a :href="item.url">{{item.name}} - {{
            item.message.length > 10 ?
                item.message.substring(0, 10) + "..." :
                item.message
          }}</a>
      </li>
    </ul>
    <ul class="git-list" v-else>
      <li><a href="/pdtail/gitIssue">Enter the Git Repository Address</a></li>
    </ul>
  </div>  
</template>

<script>

export default {
  name: "Commit",
  data() {
    return {
    }
  },

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