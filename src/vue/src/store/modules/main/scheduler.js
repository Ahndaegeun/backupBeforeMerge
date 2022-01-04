import moment from 'moment' // eslint-disable-line no-unused-vars
import axios from 'axios'

const scheduler = {
  namespaced: true,
  state() {
    return {
      selectedDate : '',
      isToggle : false,
      showAllDayEvents: 0,
      shortEventsOnMonthView: false,
      showEventCreationDialog: false,
      changeTheme : false,
      changeLang : false,
      isModal : false,
      callAddFunction : false,
      copiedData : [{}],
      data : [],
      secondData :[],
      filteredData : [],
      // 원본데이터는  배열1에 저장 렌더는 배열2에 렌더링 filter메소드는 배열 2를 가지고 렌더링,
      //  전체를 클릭시 배열 1로 다시 배열2에 렌더링 도중에 crud 시 전체로 다시 필터 초기화
      ganttData : [
        {
          // 간트 일정 별 색상을 따로 불러올 때 지정함 0~29% gray, 30%~59% blue, 60%~100% green
          class1 : 'gantt-gray',
          class2 : 'gantt-blue',
          class3 : 'gantt-green',
        }
      ],
      memInfo_scheduler:'',
      filters : [
        {
          filterName : 'all',
          koName : '전체',
          isClick: true
        },
        {
          filterName : 'common',
          koName : '공통',
          isClick: false
        },
        {
          filterName : 'individual',
          koName : '개인',
          isClick: false
        },
        {
          filterName : 'notice',
          koName : '공지',
          isClick: false
        },
        {
          filterName : 'emergency',
          koName : '긴급',
          isClick: false
        },
        {
          filterName : 'vacation',
          koName : '휴가',
          isClick: false
        },
        {
          filterName : 'note',
          koName : '기타',
          isClick: false
        },
      ],
    }
  },
  mutations: {
    resetData(state) {
      state.data = []
    },
    showData(state){
      console.log(state.addEventData)
    },
    setSelectDate(state, event){
      state.selectedDate = event
    },
    setModal(state){
      state.isModal = true
    },
    closeModal(state, e){
      for(let i in e.target.classList){
        if(e.target.classList[i] === 'black-bg' || e.target.classList[i] === 'closeModalBtn'){
          state.isModal = false
        }else{
          return
        }
      }
    },
    checkBoxClick(state, item) {
      state.data = state.secondData
      if(item.isClick) {
        item.isClick = false
        state.filters.forEach(i => {
          i.isClick = false
        })
        state.filters[0].isClick = true
        // 전체로 checked 되니 전체 데이터를 뿌려주는 함수 호출해야함
        this.commit('scheduler/setDataToSecondData')
        return
      }
      state.filters.forEach(i => {
        i.isClick = false
      })
      item.isClick = true
      this.commit('scheduler/setFilterValue', item.filterName)
    },
    setCallAddFunction(state){
      state.callAddFunction = !state.callAddFunction
      if(state.callAddFunction) {
        state.isModal = false
      }
    },
    setFilterValue(state, e){
      this.commit('scheduler/copyDataFunction')
      state.filterValue = e
      const copy = [...state.secondData]
      if(state.filterValue !== 'all'){
        let filtered = copy.filter( (v)=>(v.class === state.filterValue) )
        state.data = filtered
        state.filteredData = filtered
      }else if(state.filterValue === 'all'){
        // state.data = state.secondData
        this.commit('scheduler/setDataToSecondData')
      }
    },
    setModalTrue(state){
      state.isModal = true
    },
    setModalFalse(state){
      state.isModal = false
    },
    copyDataFunction(state){
      state.copiedData = [...state.secondData]
    },
    toggleAllDayContent(state){
      const copy = [...state.data]
      if(!state.isToggle){
        for(let i = 0; i < copy.length; i++){
          if(copy[i].allDay === true){
            copy.splice(i, 1)
          }
        }
        this.commit('scheduler/copyDataFunction')
        state.data = [...copy]
        state.showAllDayEvents = 2
      }else if(state.isToggle){
        state.data = state.filteredData
        state.showAllDayEvents = 0
      }
      state.isToggle = !state.isToggle
    },

    setData(state, arr){
      state.data = arr
    },
    pushData(state, arr){
      state.data.push(arr)
    },
    setSecondData(state, arr){
      state.secondData = arr
    },
    pushSecondData(state, arr){
      state.secondData.push(arr)
    },
    setDataToSecondData(state){
      const copy = [...state.secondData]
      state.data = copy
    },
    setMemInfo_scheduler(state, data){
      state.memInfo_scheduler = data
    },
  },
  actions : {
    getMemInfo_schduler(context, t){
      const url = 'gitAndIssue/getInfo'
      const token = t
      axios.post(url, null, {
        params : {
          token : token
        }
      })
          .then( r => {
            context.commit('setMemInfo_scheduler', r.data)
          })
    },
  }
}

export default scheduler