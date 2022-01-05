<template>
  <div class="container">
    <nav>
      <Menu/>
      <Notice v-if="$store.state.global.chatOn"/>
      <NoticeList v-if="$store.state.menu.isOpenNotification"/>
      <UserSetting v-if="$store.state.menu.isOpenUserSetting"/>
    </nav>
    <router-view></router-view>
    <Chat v-if="$store.state.global.chatOn"/>
    <!-- <SocketDetail v-if="$store.state.global.chatOn"/> -->
  </div>
</template>

<script>
import '../public/reset.css'
import Menu from './components/component/global/Menu.vue'
import Notice from './components/popup/Notice.vue'
import NoticeList from './components/popup/NoticeList.vue'
import UserSetting from './components/popup/UserSetting.vue'
import Chat from './components/popup/Chat.vue'
import {mapActions, mapMutations} from "vuex";
// import SocketDetail from './components/container/access/projectDetail/socketDetail.vue'

export default {
  name: 'App',
  components: {
    Menu,
    Notice,
    NoticeList,
    UserSetting,
    Chat,
    // SocketDetail,
  },
  data() {
    return {
      isEnterProject: false
    }
  },
  methods: {
    ...mapMutations({
      setMemIdx: 'socket/setMemIdx',
      enterProjectAlarm: 'socket/enterProjectAlarm',
    }),
    ...mapActions({
      callDataOfAllChat: "socket/callDataOfAllChat"
    })
  },
  watch: {
    'this.$store.state.global.chatOn'() {
    },
    '$route' (to) {
      if(to.path.includes('projects')) {
        this.axios({
          url: '/access/getMemNick',
          data: {
            token: sessionStorage.getItem("token")
          },
          method: 'post'
        }).then(res => {
          this.setMemIdx(res.data)
        })
      }

      const cnt = sessionStorage.getItem("enterProject")
      if(to.path.includes('pdtail') &&
          sessionStorage.getItem("token") !== null &&
          sessionStorage.getItem("project") !== null &&
          parseInt(cnt) < 2) {

        this.$store.state.global.chatOn = true
        this.$store.state.socket.s_chatData.content = []
        this.callDataOfAllChat()

        if(!this.isEnterProject) {
          this.$store.dispatch("socket/connect")
        }
        this.isEnterProject = true

      } else {
        this.$store.state.global.chatOn = false
        this.$store.commit("socket/disConnect")
        this.isConnect = false
        this.isEnterProject = false
      }
    },
  }
}
</script>

<style scoped>

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #16161A;
}

nav {
  width: 100%;
  height: 70px;
  background: #75757529;
  color: #ffffff;
}

</style>
