const projectList = {
  namespaced: true,
  state: {
    IsModalOpen: false,
    projectList: [],
    member: {},
    progressLength: 0,
    completeLength: 0
  },
  mutations: {
    changeIsModalOpen(state){
      state.IsModalOpen = !state.IsModalOpen
    },
    closeModal(state, e){
      for(let i in e.target.classList){
        if(e.target.classList[i] === 'bg-container' || e.target.classList[i] === 'fas'){
          state.IsModalOpen = false
        } else {
          return
        }
      }
    },
    pushToProjectList(state, item) {
      if(item.projectMemberDtoList.length < 1) {
        return
      }
      state.member = item.projectMemberDtoList[0].member

      if(item.projectMemberDtoList[0].project === null || item.projectMemberDtoList[0].project === undefined) {
        return
      }

      item.projectMemberDtoList.forEach(i => {
        state.projectList.push(i.project)
      })

      state.projectList.forEach(item => {
        if(item.prjctComplAt === "n" || item.prjctComplAt === "N") {
          state.progressLength++
        } else {
          state.completeLength++
        }
      })
    },
    addCreatedProject(state, item) {
      item.calendarList = []
      item.issueList = []
      state.projectList.push(item)
    },
    listRest(state) {
      state.projectList = []
      state.progressLength = 0
      state.completeLength = 0
    }
  },

  actions: {

  }
}

export default projectList