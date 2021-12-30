<template>
  <div v-if="board.열렸니" class="comment-input-div">
    <div>
      <ul>
        <li class="comment-li" v-for="(item, index) in board.commentList" :key="index">
          <div v-if="item.answerDelAt === 'N'" class="content-wrapper">
            <div>
              <div class="info-wrapper">
                <span class="name">{{ item.member.memNick }}</span>
                <span class="date">{{ item.answerDate.substring(0, 19).replace("T", " ") }}</span>
              </div>
              <textarea class="text-area" v-model="item.answerCn" :readonly="item.isModify"></textarea>
            </div>
            <div v-if="getPosition()">
              <i @click="this.changeCommentsIsOpen(item)"
                 v-if="(item.isOpen === false && board.codeDetail.codeDetailIdx === '7')
                        ||(item.isOpen === false && board.codeDetail.codeDetailIdx === '9')" class="fas fa-ellipsis-h"></i>
              <div v-else>
                <div v-if="item.member.memIdx === this.$store.state.community.signMember.memIdx">
                  <div class="box" v-if="item.isOpen === true && item.isFinish === false">
                    <i @click="this.changeIsModify(item); this.changeIsFinish(item)" class="fas fa-edit"></i>
                    <i @click="confirmDeleteComment(item, board)" class="far fa-trash-alt"></i>
                    <i @click="this.changeCommentsIsOpen(item)" class="fas fa-long-arrow-alt-left"></i>
                  </div>

                  <div id="finish-id" v-if="item.isOpen === true && item.isFinish === true"
                       @click="toUpdate(item); this.changeIsFinish(item)">Finish
                  </div>
                </div>

                <div v-else>
                  <div id="report-div">
                      <span @click="report(item)" v-if="!item.report">
                        <img class="no-report" src="@/assets/noneReport.png">
                      </span>
                      <span @click="report(item)" v-else>
                        <img class="report" src="@/assets/report.png">
                      </span>
                  </div>
                  <div>
                    <i @click="this.changeCommentsIsOpen(item)" class="fas fa-long-arrow-alt-left"></i>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </li>
      </ul>
      <div id="btn-div">
        <button v-if="board.totalComments - board.commentList.length !== 0
                      && board.totalComments - board.commentList.length > 0"
                id="more-btn"
                @click="this.extraComments(board)">더 보기
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapMutations} from 'vuex'

export default {
  name: 'BoardComment',
  data() {
    return {}
  },

  props: {
    board: Object
  },

  methods: {
    ...mapActions({
      extraComments: 'community/extraComments'
    }),

    ...mapMutations({
      changeCommentsIsOpen: 'community/changeCommentsIsOpen',
      changeCommentsIsUpdate: 'community/changeCommentsIsUpdate',
      changeIsFinish: 'community/changeIsFinish',
      changeIsModify: 'community/changeIsModify'
    }),

    confirmDeleteComment(item, board) {
      if (confirm("해당 댓글을 삭제하시겠습니까?")) {
        this.deleteComment(item, board)
      }
    },

    getReportPrompt(item){
      item.reportResn = prompt("신고 사유를 입력해주세요")
    },

    report(item){
      if(item.report === false){
        this.getReportPrompt(item)
        if(item.reportResn === null){
          alert('신고를 취고하셨습니다')
          return
        }
        if(item.reportResn.trim() === ''){
          alert('신고 사유를 정확히 입력해주세요')
          return
        }
        this.initReport(item)
      } else {
        this.cancelReport(item)
      }
      item.report = !item.report
    },

    initReport(item){
      this.axios.post('/updateCommentReport', {
        answerIdx : item.answerIdx,
        reportReason : item.reportResn,
        token : sessionStorage.getItem("token")
      })
    },

    cancelReport(item){
      this.axios.post('/deleteCommentReport', {
        answerIdx : item.answerIdx,
        token : sessionStorage.getItem("token")
      });
    },
    //댓글 삭제
    deleteComment(item, board) {
      this.axios.post('/deleteComment', {
        answerIdx: item.answerIdx,
        token: sessionStorage.getItem("token")
      })
          .then(e => {
            item.answerDelAt = e.data.answerDelAt
            board.commentsOnView -= 1
            board.totalComments = e.data.board.totalComments
          })
    },

    toUpdate(item) {
      this.axios.post('/updateComment', {
        token: sessionStorage.getItem("token"),
        answerIdx: item.answerIdx,
        content: item.answerCn
      }).then(() => {
        this.changeIsModify(item)
      })

    },

    getPosition(){
      const token = sessionStorage.getItem("token")
      if(token === null){
        return false
      }
      return true
    },

  },
}
</script>

<style scoped>
.comment-input-div {
  padding-right: 20px;
  padding-left: 20px;
}

.comment-li {
  margin-top: 20px;
  display: flex;
  width: 100%;
  align-items: center;
}

img {
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.content-wrapper {
  background-color: #414556;
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  width: 95%;
  height: fit-content;
  display: flex;
  justify-content: space-between;
}

.content-wrapper > div:first-child {
  width: 100%;
}

.info-wrapper {
  margin-bottom: 5px;
}

.info-wrapper .date {
  font-size: 10px;
  margin-left: 10px;
}

.content-detail {
  margin-left: 10px;
}

.box {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  gap: 8px;
  height: 20px;
}

i {
  cursor: pointer;
}

.comment-div {
  display: flex;
  justify-content: right;
  padding-right: 20px;
  padding-bottom: 20px;
}

#comment-btn {
  color: black;
}

textarea {
  background-color: #414556;
  color: #fff;
  height: auto;
  resize: none;
  outline: none;
  border: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
}

#finish-id {
  cursor: pointer;
}

#btn-div {
  padding-top: 10px;
  display: flex;
  justify-content: center;
}

#btn-div > button {
  color: white;
  background-color: coral;
  border-radius: 10px;
  padding: 5px 10px;
}

#report-div {
  padding-bottom: 15px;
}
</style>