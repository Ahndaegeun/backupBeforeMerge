<template>
  <div class="container">
    <h2>Issue</h2>
    <ul class="issue-list">
      <li v-for="(item, index) in this.$store.state.dashBoard.issueList"
          :key="index">
      <a :href="item.issueIdx">{{
          item.issueCn.length > 15 ?
              item.issueCn.substring(0, 15) + "..." :
              item.issueCn
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Issue",
  data() {
    return {}
  },

}
</script>

<style scoped>
.container {
  width: 20vw;
  height: 240px;
  background: #2C2F3B;
  padding: 15px 20px;
  border-radius: 5px;
  color: #ffffff;
}

h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.issue-list {
  padding-left: 10px;
  font-size: 18px;
  color: #999999;
}

.issue-list li {
  margin-bottom: 10px;
}

.issue-list li:last-child {
  margin: 0;
}

.issue-list a {
  transition: color .2s ease-in;
}

.issue-list a:hover {
  color: #ffffff;
}
</style>