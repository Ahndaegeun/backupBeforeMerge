<template>
  <div>
    <vue-cal
        small
        locale='ko'
        hide-view-selector

        @cell-dblclick="this.setModalTrue()"

        :time-from="0 * 60"
        :time-to="24 * 60"
        :transitions="false"
        active-view="week"
        :disable-views="['years', 'year', 'month', 'day']"
        resize-x
        :editable-events="{ title: false, drag: true, resize: true, delete: true, create: false }"
        :events=$store.state.scheduler.data
        class="vuecal--dark-theme vuecal--full-height-delete"

        @event-delete="deleteEventFunction"
        @event-duration-change="updateEventFunction"
        @event-drop="updateEventFunction"

        :drag-to-create-event="false"

        :selected-date=$store.state.scheduler.selectedDate
        ref="vuecal"
        style="width: 100% ;height: 100%;"
        :show-all-day-events="['short', true, false][this.$store.state.scheduler.showAllDayEvents]"
    >
    </vue-cal>
  </div>

</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import VueCal from 'vue-cal'

export default {
  components:{
    VueCal,
  },
  data() {
    return {
      eventsCssClasses: ['common', 'individual', 'notice', 'emergency', 'vacation', 'note', 'gantt', 'deleted'],
      showEventCreationDialog: false,
      changeTheme : false,
      changeLang : false,
      prjctIdx : sessionStorage.getItem('project'),
      token : sessionStorage.getItem('token'),
    }
  },
  computed : {
    ...mapState({
      datas : state => state.scheduler.data,
    })
  },
  mounted() {
    this.resetData()
    this.sendTokenInfo()
    // if(this.datas.length === 0) this.callCalendarData()
  },
  methods: {
    ...mapMutations({
      // 단일 vuex일때는 'store명/함수명'이 아닌 '함수명'을 기재해야 작동한다.
      setModal : 'scheduler/setModal',
      setCallAddFunction : 'scheduler/setCallAddFunction',
      closeModal : 'scheduler/closeModal',
      toggleAllDayContent : 'scheduler/toggleAllDayContent',
      setData : 'scheduler/setData',
      setSecondData : 'scheduler/setSecondData',
      pushSecondData : 'scheduler/pushSecondData',
      setModalTrue : 'scheduler/setModalTrue',
      resetData: 'scheduler/resetData'
    }),
    ...mapActions({
      getMemInfo_schduler : 'scheduler/getMemInfo_schduler',
    }),
    sendTokenInfo(){
      this.getMemInfo_schduler(this.token)
      setTimeout(() => {
        this.callCalendarData()
      }, 300);
    },
    deleteEventFunction(e){
      let copy = [...this.$store.state.scheduler.data];
      for(let i = 0; i<copy.length; i++){
        if(e.id === copy[i].id){
          // copy.splice(i,1);
          copy[i].id = e.id
          copy[i].title = '<span style="text-decoration: line-through;">'+ e.title + '</span>'
          copy[i].content = '<span style="text-decoration: line-through;">'+ e.content + '<br><br><i class="fas fa-times" style="font-size:50px;"></i>'+ '</span>'
          copy[i].class = 'deleted'
          copy[i].deletable = false
          copy[i].draggable = false
          copy[i].resizable = false
        }
        this.setData(copy)
      }
      this.callAxios('delete', e)
    },

    updateEventFunction(e){

      const {start, end, id, content, title} = e.event

      let momentedStartTime = start.format('YYYY-MM-DD HH:mm')
      let momentedEndTime = end.format('YYYY-MM-DD HH:mm')
      let dataArr = {
        calIdx : id,
        calStartDate : momentedStartTime,
        calEndDate : momentedEndTime,
        calColor : e.event.class,
        calCn : content,
        calTitle : title,
        class : e.event.class,
      }

      for(let i = 0; i < this.datas.length; i++){
        if(this.datas[i].id === e.event.id){
          this.datas[i].start = momentedStartTime
          this.datas[i].end = momentedEndTime
          this.datas[i].title = e.event.title
          this.datas[i].content = e.event.content
          this.datas[i].class = e.event.class
        }
      }
      this.callAxios('update', dataArr)
    },

    callCalendarData(){
      const copy = [...this.$store.state.scheduler.data];
      const url = '/calendar/getAllSchedules'
      const memIdx = this.$store.state.scheduler.memInfo_scheduler.memIdx

      if(this.datas.length !== 0) return


      this.axios.get( url, {
        params : {
          prjctIdx : this.prjctIdx,
          token : sessionStorage.getItem("token")
        }
      })
          .then( (r)=>{

            for(let i = 0; i < r.data.length; i++){

              if(r.data[i].calColor === 'individual'){
                if(r.data[i].member.memIdx !== memIdx) continue
              }

              r.data[i].calStartDate = r.data[i].calStartDate.replace('T', ' ')
              r.data[i].calEndDate = r.data[i].calEndDate.replace('T', ' ')

              if(r.data[i].calDelAt === 'y'){
                const arr = {
                  id :  r.data[i].calIdx,
                  start : r.data[i].calStartDate,
                  end : r.data[i].calEndDate,
                  title : '<span style="text-decoration: line-through;">'+r.data[i].calTitle + '</span>',
                  content : '<span style="text-decoration: line-through;">'+ r.data[i].calCn + '<br><br><i class="fas fa-times" style="font-size:50px;"></i>'+ '</span>',
                  class : 'deleted',
                  deletable : false,
                  resizable : false,
                  draggable : false,
                  allDay : false,
                }
                copy.push(arr)
                this.pushSecondData(arr)
              }else{
                const arr = {
                  id  : r.data[i].calIdx,
                  start: r.data[i].calStartDate,
                  end : r.data[i].calEndDate,
                  title : r.data[i].calTitle,
                  content : r.data[i].calCn,
                  class : r.data[i].calColor,
                  allDay : false,
                }
                if(r.data[i].calIsAllDay === 'y'){arr.allDay = true}
                if(r.data[i].calIsDeletable === 'y'){arr.deletable = false}
                if(r.data[i].calIsResizable === 'y'){arr.resizable = false; arr.draggable = false}
                copy.push(arr)
                this.pushSecondData(arr)
              }
            }
            if(this.datas.length === 0){
              this.setData(copy)
              this.setSecondData(copy)
            }

          })
    },

    callAxios(type, dataArr){
      switch (dataArr.class) {
        case "common":
          dataArr.class = 1
          break;
        case "individual":
          dataArr.class = 2
          break;
        case "notice":
          dataArr.class = 3
          break;
        case "emergency":
          dataArr.class = 4
          break;
        case "vacation":
          dataArr.class = 5
          break;
        case "note":
          dataArr.class = 6
          break;
      }
      if(type === 'update'){
        const url = '/calendar/updateSchedule'
        const prjctIdx = this.prjctIdx
        this.axios.post( url, null, {
          params : {
            calIdx : dataArr.calIdx,
            calStartDate : dataArr.calStartDate ,
            calEndDate : dataArr.calEndDate ,
            calColor : dataArr.calColor,
            calTitle : dataArr.calTitle,
            calCn : dataArr.calCn,
            'project.prjctIdx' : prjctIdx,
            'member.memIdx' : this.$store.state.scheduler.memInfo_scheduler.memIdx,
            'codeDetail.codeDetailIdx' : dataArr.class,
            'codeDetail.masterCode.masterCodeIdx' : 'CAL',
          }
        })
      }

      if(type === 'delete'){
        const url = '/calendar/deleteSchedule'
        this.axios.post( url, null, {
          params : {
            calIdx : dataArr.id,
            calDelAt : 'y',
          }
        })
      }

    }

  },
  watch : {
  }
}
</script>

<style>

.vuecal--dark-theme.vuecal--full-height-delete{
  transition: all 1s ease;
}
.fas.fa-times{
  pointer-events : none;
}
</style>