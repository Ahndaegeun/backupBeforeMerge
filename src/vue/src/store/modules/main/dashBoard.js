import axios from "axios"
import moment from 'moment'

const dashBoard = {
    namespaced: true,
    state: {
        gantt: [],
        progressNow: 0,
        progressTotal: 0,
        memberList: [],
        gitCommit: "",
        issue: [],
        finishDay: 0,
        boardList: [],
        scheduleList: [],
        readMeContent: "",
        projectIdx: 1,
        start: "",
        end: "",

    },
    mutations: {
        setReadMeContent(state, contents) {
            state.readMeContent = contents
        },
        setMemberList(state, item) {
            state.memberList = item
        },
        setFinishDay(state, day) {
            state.finishDay = day
        },
        setBoardList(state, list) {
            state.boardList = list
        },
        setIssueList(state, list) {
            state.issueList = list
        },
        setScheduleList(state, list) {
            state.scheduleList = list
        },
        setProgress(state, list) {
            const total = list.length
            let now = 0
            list.forEach(item => {
                if(item.gtState === "Y") {
                    now++
                }
            })
            state.progressNow = now
            state.progressTotal = total
        },
        setGitRepo(state, repo) {
            const result = repo.substring(0, repo.lastIndexOf("/")) + "/commits"
            state.gitCommit = result
        }
    },
    actions: {
        saveReadMe(context, contents) {
            const url = "/pdtail/saveReadMe"
            axios.post(url, null, {
                params: {
                    prjctIdx: 1,
                    prjctReadMe: contents
                }
            })
                .then(res => {
                    if (res) {
                        context.commit("setReadMeContent", contents)
                    }
                })
        },
        mountGetData(context) {
            moment.locale("en")
            const url = "/dashboard/getData"
            axios.get(url, {
                params: {
                    prjctIdx: sessionStorage.getItem("project"),
                }
            })
                .then(res => {
                    context.commit("setMemberList", res.data.projectMemberList)
                    console.log(res.data)
                    const end = moment(res.data.project.prjctEndDate, "YYYY-MM-DD").fromNow().split(" ")
                    end.forEach(item => {
                        if(!isNaN(item)) {
                            context.commit("setFinishDay", item)
                        }
                    })
                    context.commit("setReadMeContent", res.data.project.prjctReadMe)
                    // context.commit("setBoardList", res.data.boardList)
                    context.commit("setIssueList", res.data.issueList)
                    context.commit("setScheduleList", res.data.calendarList)
                    context.commit("setProgress", res.data.ganttList)
                    context.commit("setGitRepo", res.data.git.gitRepo)
                })
        }
    }
}

export default dashBoard