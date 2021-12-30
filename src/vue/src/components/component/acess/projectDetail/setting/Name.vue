<template>
  <div class="project-name-div">
    <div class="text-div">{{ this.$store.state.setting.projectData.prjctNm }}</div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.project-name-div {
  border-radius: 5px;
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #2C2F3B;
  color: white;
}

</style>