<template>
  <ul class="setting-container">
    <li class="id">
      <span class="badge">ID</span>
      <span class="content" v-text="userDetail.memId"></span>
    </li>
    <li class="nick">
      <span class="badge">NickName</span>
      <input class="content" v-model="userDetail.memNick">
    </li>
    <li class="k-tag">
      <span class="badge">K Tag</span>
      <span class="content" v-text="userDetail.memTag"></span>
    </li>
    <li class="phone">
      <span class="badge">Phone</span>
      <input class="content" v-model="userDetail.memCelNum">
    </li>
    <li class="password">
      <span class="badge">Password</span>
      <input class="content" v-model="userDetail.memPass">
    </li>
    <li class="profile-img">
      <span class="img-wrap">
        <img v-if="userDetail.memImg === '' || userDetail.memImg === null" :src="changeImg" alt="userProfile">
        <img v-else-if="isChange" :src="changeImg">
        <img v-else :src="userDetail.memImg" alt="userProfile">
      </span>
      <input @change="modifyImg" type="file" class="content" accept="image/*">
    </li>
    <li><button @click="modify">modify</button></li>
  </ul>
</template>

<script>
export default {
  name: "userSetting",
  data() {
    return {
      userDetail: {},
      changeImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAYAAABG1c6oAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADRSURBVHgBrZQLDYMwEIb/LhMADnAwCasUJOAAHMzCLEwBm4M5AAfg4HYXWNYM+qRfck3T9L70cS3ggIg0R88x0YL0a6TAiS3ZaWNlNfnRMcI+QNjv5SqLkOBnVkqV/4Mn22T4KfYGbcI3/LwQylouPmrEwAmdQ9YhBVrK57lKprWvXTnKI5SD1/hdwCjBtzsicmXfJ2etwaAz5EkVhRW1Ka5csoHiGTbSAzJTWpjCOx3nJi5Fy3IH5KGUp9cgH40IL8jHVbY8wfJzJDCfuXkgIx+zEByVvJWBBgAAAABJRU5ErkJggg==",
      isChange: false
    }
  },
  mounted() {
    this.axios({
      url: '/access/userInfo',
      method: 'post',
      data: {
        token: sessionStorage.getItem("token")
      }
    }).then(res => {
      res.data.memPass = "****"
      this.userDetail = res.data
    })
  },
  methods: {
    modify() {
      const reqData = {...this.userDetail}
      this.axios({
        url: '/access/userModify',
        method: 'post',
        data: reqData
      })
    },
    modifyImg(e) {
      this.isChange = false
      const files = e.target.files
      const file = files[0]
      const maxSize = 5 * 1024 * 1024
      const fileSize = file.size
      if (fileSize > maxSize) {
        alert('첨부파일은 5MB 이내로 등록 가능합니다.')
        e.target.value = ''
      }
      const form = new FormData()

      form.append("file", file)
      form.append("fileSize", fileSize)

      let baseImg = ""
      const reader = new FileReader()
      reader.onload = readerEvt => {
        const binaryString = readerEvt.target.result
        baseImg = btoa(binaryString)
        const img = "data:image/png;base64," + baseImg
        this.changeImg = img
        this.axios.post("/access/userImg", {
          img: img,
          token: sessionStorage.getItem("token")
        }).then(() => {
          this.isChange = true
        }).catch(() => {
          this.isChange = false
        })

      }
      reader.readAsBinaryString(file)

    }
  }
}
</script>

<style scoped>
.setting-container {
  background: #16161A;
  border: 1px solid #999;
  position: absolute;
  top: 70px;
  right: 0;
  width: 20vw;
  border-radius: 10px;
  z-index: 10;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.setting-container > li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.badge {
  background: #3F80A9;
  color: #fff;
  width: 40%;
  text-align: center;
  padding: 5px;
  border-radius: 20px;
  margin-right: 10px;
}

.img-wrap {
  width: 80px;
  text-align: center;
}

img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

button {
  color: #fff;
  margin-left: auto;
}

input {
  border: none;
  background: none;
  outline: none;
  color: #fff;
}

.content {
  border-bottom: 1px solid #999;
  width: 60%;
}
</style>