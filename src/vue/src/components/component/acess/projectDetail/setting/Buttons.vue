<template>
  <div>
    <button class="modify-btn" @click="postModify">수정</button>
    <button class="end-btn" @click="postEnd">Project End</button>
    <button class="delete-btn" @click="postDelete">Project Delete</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  methods :{

    postModify(){
        axios.post('/setting/modifyProjectMember',{
          params : this.$store.state.setting.projectMemberList

        }).then(res =>{
          console.log(res.data);
          alert("정상적으로 수정되었습니다.");
        }).catch(err =>{
          console.log(err.data);
          alert("수정에 실패했습니다.");
        });
    },

    postDelete(){
      if(confirm("삭제하시겠습니까?")){
        this.$store.state.setting.projectData.prjctDelAt = "y";
          axios.post('/setting/modifyProject', {
            params : this.$store.state.setting.projectData

          }).then(res =>{
            console.log(res.data);
            alert("정상적으로 삭제되었습니다..");
          }).catch(err =>{
            console.log(err.data);
            alert("삭제에 실패했습니다.");
          });
      }else{
        alert("취소되었습니다.")
      }
    },
    postEnd(){

      if(confirm("프로젝트를 종료하시겠습니까?")){
          this.$store.state.setting.projectData.prjctComplAt = "y";
          console.log(this.$store.state.setting.projectData);

          axios.post('/setting/modifyProject', {
            params : this.$store.state.setting.projectData

          }).then(res =>{
            console.log(res.data);
            alert("정상적으로 종료되었습니다..");
          }).catch(err =>{
            console.log(err.data);
            alert("종료에 실패했습니다.");
          });
      }else{
        alert("취소되었습니다.")
      }
    },

  }
}
</script>

<style scoped>
div{

  display :flex;
  justify-content : flex-end;
  align-items : stretch;
  flex-direction: row;
  width : 60vw;
  height : 100px;

}
.modify-btn{
  background-color : #FF8906;
  width : 100px;
  height : 30px;
  margin : 20px;
  border-radius : 5px;
}

.end-btn{
  background-color : #FF8906;
  width : 180px;
  height : 30px;
  margin : 20px;
  border-radius : 5px;

}

.delete-btn{
  background-color : #FF5C5C;
  width : 180px;
  height : 30px;
  margin : 20px;
  border-radius : 5px;

}
</style>