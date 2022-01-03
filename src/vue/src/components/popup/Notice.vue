<template>
  <div class="notice-container">
    <div
        :id="`notice-${index}`"
        class="notice-box"
        v-for="(message, index) in messages"
        :key="index"
    >
      <p class="notice-text">
        <span class="text-wrap">{{ message.user }} {{ message.content }}</span>
        <button @click="closeNotice(index)" class="notice-close-btn">
          <i class="fas fa-times"> </i>
        </button>
      </p>

      <div class="notice-bar">
        <div class="notice-bar-fill" :style="{background : message.color }"></div>
      </div>


    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import moment from 'moment'
moment.locale('ko')

export default {
  updated() {
    for (let index in this.messages) {
      setTimeout(() => {
        document.querySelector(`#notice-${index}`).style.display = "none";
      }, 5900);
    }
    clearTimeout();
  },
  data() {
    return {
      messages: [],
      alarmColor : '',
    };
  },
  computed: {
    ...mapState({
      receiveAlarmData : state => state.socket.receiveAlarmData,
      receiveGanttAlarmData : state => state.socket.receiveGanttAlarmData,
      receiveProjectBoardAlarmData : state => state.socket.receiveProjectBoardAlarmData,
      receiveIssueAlarmData: state => state.socket.receiveIssueAlarmData,
      receiveEnterProjectAlarmData: state => state.socket.receiveEnterProjectAlarmData,
      receiveKanbanAlarmData: state => state.socket.receiveKanbanAlarmData
    })
  },
  methods: {
    ...mapMutations({
      getAlarmColor : 'socket/getAlarmColor',
      setAlarmColor : 'socket/setAlarmColor',
    }),
    closeNotice(index) {
      document.querySelector(`#notice-${index}`).style.display = "none";
    },
    calendarNotice() {
      if(this.receiveAlarmData.alarmCategory != 'calendar') return
      if(this.receiveAlarmData.memIdx == this.$store.state.git.memInfo.memIdx) return
      if(sessionStorage.getItem("project") != this.receiveAlarmData.prjctIdx) return
      if(this.receiveAlarmData.alarmCategory == 'individual') return

      let tempCategory = ''
      let tempDate = ''
      let tempId = this.receiveAlarmData.memNick
      let tempColor = this.receiveAlarmData.alarm
      switch (this.receiveAlarmData.calCategory) {
        case 'common':
          tempCategory = '공통'
          break;
        case 'individual':
          tempCategory = '개인'
          break;
        case 'notice':
          tempCategory = '공지'
          break;
        case 'emergency':
          tempCategory = '긴급'
          break;
        case 'vacation':
          tempCategory = '휴가'
          break;
        case 'note':
          tempCategory = '기타'
          break;
      }
      tempDate = this.receiveAlarmData.date
      tempDate = moment(tempDate).format('MMM Do')
      this.messages.push({
        user: tempId,
        content: `님이 ${tempDate}에 ${tempCategory} 일정을 추가하셨습니다.`,
        color: tempColor,
      });
    },
    ganttNotice(){
      if(this.receiveGanttAlarmData.memIdx == this.$store.state.gantt.memIdx) return
      if(sessionStorage.getItem("project") != this.receiveGanttAlarmData.prjctIdx) return

      let alarmColor = ''
      let ganttState = ''
      switch (this.receiveGanttAlarmData.date) {
        case '낮음':
          alarmColor = '#4caf50'
          break;
        case '보통':
          alarmColor = '#0091ff'
          break;
        case '높음':
          alarmColor = '#ffbf00'
          break;
        case '긴급':
          alarmColor = '#ff6f00'
          break;
        case '즉시':
          alarmColor = '#f44336'
          break;
      }
      if( this.receiveGanttAlarmData.alarm == 'N'){
        ganttState = '신규'
      }

      this.messages.push({
        user : this.receiveGanttAlarmData.memNick,
        content : `님이 ${ganttState} 일감(${this.receiveGanttAlarmData.text})을 추가하셨습니다. `,
        color : alarmColor,
      })
    },
    projectBoardNotice(){
      if(this.receiveProjectBoardAlarmData.memIdx == this.$store.state.community.signMember.memIdx) return
      if(sessionStorage.getItem("project") != this.receiveProjectBoardAlarmData.prjctIdx) return

      this.messages.push({
        user : this.receiveProjectBoardAlarmData.memNick,
        content : `님이 Project Board에 게시글을 추가하셨습니다.`,
        color : '#FF8906',
      })
    },
    issueNotice() {
      if(this.receiveIssueAlarmData.memIdx == this.$store.state.git.memInfo.memIdx) return
      if(sessionStorage.getItem("project") != this.receiveIssueAlarmData.prjctIdx) return

      this.messages.push({
        user : this.receiveIssueAlarmData.memNick,
        content : `님이 ${this.receiveIssueAlarmData.text} 이슈를 추가하셨습니다.`,
        color : '#3F80A9',
      })
    },
    enterProjectNotice() {
      if(this.receiveEnterProjectAlarmData.memIdx == this.$store.state.socket.projectArr.memIdx) return
      if(sessionStorage.getItem("project") != this.receiveEnterProjectAlarmData.prjctIdx) return
      this.messages.push({
        user : this.receiveEnterProjectAlarmData.memNick,
        content : `님이 프로젝트에 입장하셨습니다.`,
        color : '#05f19c',
      })
    },
    kanbanNotice(){
      if(this.receiveKanbanAlarmData.memIdx == this.$store.state.kanban.memIdx) return
      if(sessionStorage.getItem("project") != this.receiveKanbanAlarmData.prjctIdx) return
      this.messages.push({
        user : this.receiveKanbanAlarmData.memNick,
        content : `${this.receiveKanbanAlarmData.text}`,
        color : '#05f19c',
      })
    },
  },
  created() {

  },
  watch : {
    '$store.state.socket.alarmColor'() {
    },
    '$store.state.socket.alarmCnt'() {
      this.calendarNotice()
    },
    '$store.state.socket.ganttAlarmCnt'() {
      this.ganttNotice()
    },
    '$store.state.socket.projectBoardAlarmCnt'() {
      this.projectBoardNotice()
    },
    '$store.state.socket.issueAlarmCnt'() {
      this.issueNotice()
    },
    '$store.state.socket.enterProjectAlarmCnt'() {
      this.enterProjectNotice()
    },
    '$store.state.socket.kanbanAlarmCnt'() {
      this.kanbanNotice()
    },
  },

};
</script>

<style>
.notice-container {
  position: fixed;
  right: 0;
  top: 70px;
  display: flex;
  flex-direction: column;
  z-index: 10;
}
.notice-box {
  margin-bottom: 10px;
  width: 280px;
  height: 60px;
  right: 0;
  background: #414556;
  display: flex;
  align-items: center;
  position: relative;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 5px;
  transform: translate(-100%);
  animation: slide 6s linear;
  box-shadow: 3px 5px 16px rgba(255, 255, 255, 0.2) inset;
  overflow: hidden;
}

.notice-text {
  margin: 5px 5px 20px 5px;
}

.notice-box i {
  position: absolute;
  top: 0;
  right: 2%;
}

.notice-box button{
  color:white
}

.notice-bar {
  height: 7px;
  width: 278px;
  background: #fff;
  position: absolute;
  bottom: 0;
}

.notice-bar-fill {
  background: #3f80a9;
  width: 100%;
  height: 100%;
  animation: progress 5s linear;
  box-shadow: 2px 2px 3px rgba(255, 255, 255, 0.3) inset;
}

.text-wrap {
  width: 90%;
  display: block;
  top: 10px;
  left: 10px;
  position: absolute;
}

.notice-close-btn {
  top: 10px;
  position: absolute;
  right: 10px;
}

@keyframes progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

@keyframes slide {
  0% {
    transform: translate(100%);
  }
  9%,
  80% {
    transform: translate(0%);
  }
  90%,
  100% {
    transform: translate(100%);
  }
}
</style>