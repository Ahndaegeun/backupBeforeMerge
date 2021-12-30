<template>
  <div class="main-div">
    <div class="main-top">
      <div class="main-start-text">
        <h3>멤버 관리</h3>
      </div>
      <div class="insert-btn-div">
        <button class="insert-btn" v-if="this.$store.state.setting.clickState === false" @click="changeClickState">수정
        </button>
        <button class="insert-btn" v-if="this.$store.state.setting.clickState === true" @click="changeClickState">닫기
        </button>

      </div>
    </div>
    <div class="main-bottom">

      <ul class="member-ul">
        <!--        <div class="member-ul-div">-->
        <li v-for="(item,index) in this.$store.state.setting.projectMemberList" class="member-li" :key=index
            :id="`memberList-${index}`">
          <div class="member-info-div">
            <div class="member-li-img-div">
              <img :src="item.member.memImg" class="member-img" alt="">
            </div>

            <div class="member-li-name-div">{{ item.member.memNick }}</div>
            <div class="member-li-ktag-div">{{ item.member.memTag }}</div>
          </div>
          <div class="member-li-role-div">
            <div>
              <span class="role-span" :class="{red : item.tempRoleData.PM}" :id="`PM-span${index}`" @click="spanClick('PM', index, item)">PM</span>
              <span class="role-span" :class="{red : item.tempRoleData.PL}" :id="`PL-span${index}`" @click="spanClick('PL', index, item)">PL</span>
              <span class="role-span" :class="{red : item.tempRoleData.DA}" :id="`DA-span${index}`" @click="spanClick('DA', index, item)">DA</span>
              <span class="role-span" :class="{red : item.tempRoleData.TA}" :id="`TA-span${index}`" @click="spanClick('TA', index, item)">TA</span>
              <span class="role-span" :class="{red : item.tempRoleData.AA}" :id="`AA-span${index}`" @click="spanClick('AA', index, item)">AA</span>
              <span class="role-span" :class="{red : item.tempRoleData.UA}" :id="`UA-span${index}`" @click="spanClick('UA', index, item)">UA</span>
              <span class="role-span" :class="{red : item.tempRoleData.BA}" :id="`BA-span${index}`" @click="spanClick('BA', index, item)">BA</span>
              <span class="role-span" :class="{red : item.tempRoleData.EA}" :id="`EA-span${index}`" @click="spanClick('EA', index, item)">EA</span>
              <span class="role-span" :class="{red : item.tempRoleData.SA}" :id="`SA-span${index}`" @click="spanClick('SA', index, item)">SA</span>
            </div>
          </div>
        </li>
        <!--        </div>-->
      </ul>
    </div>

  </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  data() {
    return {

      selectedStyle: {
        color: '#FF8906'
      },

    }
  },
  methods: {
    ...mapMutations({
      changeClickState: 'setting/changeClickState',
      // spanClick: 'setting/spanClick',
      isRoleMatch: 'setting/isRoleMatch',
      clickModifyBtn: 'setting/clickModifyBtn',
    }),

    spanClick(role, index, item){ // 클릭했을 때 이벤트 (배열에 데이터 넣음)
      if(role === 'PM'){ // PM 일 때
        alert("PM은 수정할 수 없습니다.")
      } else{ // PM 이 아닐 때
        if(item.roleList.includes(role)){
          for(let j = 0; j < item.roleList.length; j++){
            item.roleList.splice(j, 1);
          }
          let tempStr = "";
          for(let j = 0; j < item.roleList.length; j++){
            tempStr += item.roleList[j] + ",";
          }
          item.prjctMemRole = tempStr;
          document.getElementById(role + '-span' + index).style.color = "white";
        } else{
          item.roleList.push(role)
          let tempStr = "";
          for(let j = 0; j < item.roleList.length; j++){
            tempStr += item.roleList[j] + ",";
          }
          item.prjctMemRole = tempStr;
          document.getElementById(role + '-span' + index).style.color = "red";
        }
      }
    }
  },
  computed :{
    classObject(){
      return {
      }
    }
  },
  mounted() {
  },

}
</script>

<style scoped>
.main-div {
  border-radius: 5px;
  background-color: #2C2F3B;
  color: white;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  font-size: 20px;
  overflow: hidden;
  padding: 20px;


}

.main-top {
  display: flex;
  /*align-items: stretch;*/
  justify-content: space-between;
  /*height: 20%;*/
}

.main-bottom {
  height: 80%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  /*align-items: flex-start;*/
  padding: 5px;

}

.insert-btn-div {
  border-radius: 5px;
  background-color: #FF8906;
  display: inline-block;
  width: 46px;
  height: 30px;
}

.insert-btn {
  width: 100%;
  height: 100%;
  color: white;
}

.member-info-div{
  display: flex;
  justify-content: flex-start;
  margin-right: 20px;
  width: 30%;
  /*height: ;*/
}


.member-li {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

}

.member-li-img-div {
  border-radius: 70%;
  overflow: hidden;
  margin-left: 20px;
}

.member-li-role-div{
  display: flex;
  justify-content: space-around;
  margin-right: 20px;
}



.member-img {
  width: 40px;
  height: 40px;
  margin-right: 20px;
}

.member-ul {
  overflow-x: hidden;
  overflow-y: auto;

}

.member-ul::-webkit-scrollbar {
  display: none;
}

.role-span {
  margin-right: 25px;
  color: white;
  cursor:pointer

}

.red {
  margin-right: 25px;
  color: red;
  cursor:pointer
}

</style>