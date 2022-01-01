import router from "@/router";

const global = {
  namespaced: true,
  state: {
    chatOn: false,
    projectIdx: 0,
    isLogin: false
  },
  mutations: {
    moveToDashBoard(state, project) {
      sessionStorage.setItem("project", project.prjctIdx)
      router.push('/pdtail/dashboard')
    },
    moveToIssue(state, issue) {
      sessionStorage.setItem("project", issue.prjctIdx)
      router.push('/pdtail/gitissue')
    },
    moveToCalendar(state, calendar) {
      sessionStorage.setItem("project", calendar.project.prjctIdx)
      router.push('/pdtail/scheduler')
    },
  },
  actions: {

  }
}

export default global