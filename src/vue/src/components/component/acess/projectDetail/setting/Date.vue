<template>
  <div class="project-date-div" >
    <div class="modal-background" v-if="modalState === true" >
      <vue-cal
          class="vuecal--date-picker"
          xsmall
          hide-view-selector
          :time="false"
          :transitions="false"
          @cell-click="selectedDate"
          active-view="month"
          :disable-views="['week', 'day']"
          style="width: 250px;height: 250px">
      </vue-cal>
    </div>

    <div class="text-div">
      프로젝트 기간 변경
    </div>
    <div class="date-div">
      <label for="start-date">Start</label>&nbsp;
      <input type="text" class="date-input" id="start-date" @click="clickStartDateFunction"
             v-model="this.$store.state.setting.projectData.prjctStartDate"
        autocomplete="off">&nbsp;
      <label for="end-date">End</label>&nbsp;
      <input type="text" class="date-input" id="end-date" @click="clickEndDateFunction"
             v-model="this.$store.state.setting.projectData.prjctEndDate"
        autocomplete="off">
    </div>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import moment from 'moment'
import {mapMutations} from "vuex";
import axios from "axios";

export default {
  data() {
    return {

      clickStart : false,
      clickEnd : false,
      modalState : false,

    }
  },
  components : {
    VueCal,
  },
  methods : {
    ...mapMutations({
      changeDate : 'setting/changeDate'
    }),
    selectedDate(e){
      if(this.clickStart === true){

        this.$store.state.setting.projectData.prjctStartDate = moment(e).format('YYYY/MM/DD')
        this.$store.state.setting.projectData.prjctStartDate = moment(e).format('YYYY/MM/DD')
        if(this.checkDate(this.$store.state.setting.projectData.prjctStartDate,
            this.$store.state.setting.projectData.prjctEndDate) === false){
          this.$store.state.setting.projectData.prjctStartDate = ""
        }
      }else if(this.clickEnd === true){
        this.$store.state.setting.projectData.prjctEndDate = moment(e).format('YYYY/MM/DD')
        this.$store.state.setting.projectData.prjctEndDate = moment(e).format('YYYY/MM/DD')
        if(this.checkDate(this.$store.state.setting.projectData.prjctStartDate,
            this.$store.state.setting.projectData.prjctEndDate) === false){
          this.$store.state.setting.projectData.prjctStartDate = ""
        }
      }
      this.modalState = false;
      this.clickStart = false;
      this.clickEnd = false;
      this.checkDate(this.$store.state.setting.projectData.prjctStartDate, this.$store.state.setting.projectData.prjctEndDate)
      console.log(this.$store.state.setting.projectData.prjctStartDate)
      console.log(this.$store.state.setting.projectData.prjctEndDate)
    },
    clickStartDateFunction(){
      if(this.modalState === false){ this.modalState = true; this.clickStart = true;}

      else {this.modalState = false; }
    },
    clickEndDateFunction(){
      if(this.modalState === false){ this.modalState = true; this.clickEnd = true;}
      else this.modalState = false
    },

    checkDate(start, end){
      let startDate = moment(start).format('YYYYMMDD')
      let endDate = moment(end).format('YYYYMMDD')
      if(endDate - startDate < 0){
        alert("날짜가 잘못되었습니다.")
        this.$store.state.setting.projectData.prjctStartDate = "";
        this.$store.state.setting.projectData.prjctEndDate = "";
        return false;
      } else if(startDate === '0' && startDate == null && endDate === '0' && endDate == null){
        return false;
      } else {
        let axiosStartDate = moment(start).format('YYYY-MM-DD')
        let axiosEndDate = moment(end).format('YYYY-MM-DD')
        this.$store.state.setting.projectData.prjctStartDate = axiosStartDate;
        this.$store.state.setting.projectData.prjctEndDate = axiosEndDate;

        console.log("changeDate")
        axios.post('/setting/changeProjectDate', {
          params: this.$store.state.setting.projectData
        }).then(() => {
          console.log("잘됨ㅋㅋ");
        }).catch( () => {

        })
      }

    }


  },
  mounted() {
    // this.loadStoreDate();
  }
}
</script>

<style scoped>
.project-date-div{
  position :relative;
  border-radius : 5px;
  padding : 15px;
  display :flex;
  justify-content : space-around;
  flex-direction : column;
  box-sizing: border-box;
  background-color : #2C2F3B;
  color : white;
  width: 100%;
  height: 100%;

}
.date-div{

  color : black;

}
.date-input{
  background-color : #414556;
  border : 0px;
  border-radius : 5px;
  width : 300px;
  height : 30px;


}
.modal-background{
  position: absolute;
  width: 18.5vw; height:30vh;
  margin-left: 50vh;


}
.vuecal--date-picker{
  width: 100%;
  background: #646464;
  border-radius: 8px;
  padding: 20px;
}
</style>