import axios from "axios"
import moment from 'moment'
import dotenv from 'dotenv'
dotenv.config()
const API_KEY = process.env.VUE_APP_API_KEY

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
        commitList: [],
        isUpdate: true
    },
    mutations: {
        setReadMeContent(state, contents) {
            state.readMeContent = contents
        },
        setMemberList(state, item) {
            state.memberList = item
        },
        setFinishDay(state, day) {
            console.log(day)
            state.finishDay = day
        },
        setBoardList(state, list) {
            state.boardList = list
        },
        setIssueList(state, list) {
            state.issueList = list
        },
        setScheduleList(state, list) {
            state.scheduleList = []
            list.forEach(item => {
                const obj = {
                    id: item.calIdx,
                    start: item.calStartDate.replace("T", " "),
                    end: item.calEndDate.replace("T", " "),
                    title: item.calTitle,
                    content: item.calCn,
                    class: item.calColor,
                    deletable: false,
                    resizable: false,
                    draggable: false,
                    allDay: false,
                }
                if(item.calDelAt === "y") {
                    obj.title = '<span style="text-decoration: line-through;">'+ item.calTitle + '</span>'
                    obj.content = '<span style="text-decoration: line-through;">'+ item.calCn + '<br><br><i class="fas fa-times" style="font-size:50px;"></i>'+ '</span>'
                    obj.class = 'deleted'
                }
                state.scheduleList.push(obj)
            })
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
            let result = ""
            if(repo !== "") {
                result = repo.substring(0, repo.lastIndexOf("/")) + "/commits"
            }
            state.gitCommit = result
        }
    },
    actions: {
        saveReadMe(context, contents) {
            context.state.isUpdate = false
            const url = "/pdtail/saveReadMe"
            axios.post(url, null, {
                params: {
                    prjctIdx: sessionStorage.getItem("project"),
                    prjctReadMe: contents
                }
            })
                .then(res => {
                    if (res) {
                        context.commit("setReadMeContent", contents)
                        context.state.isUpdate = true
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
                    const end = moment(res.data.project.prjctEndDate, "YYYY-MM-DD")
                    const now = moment()

                    context.commit("setFinishDay", Math.floor(moment.duration(end.diff(now)).asDays()))
                    context.commit("setReadMeContent", res.data.project.prjctReadMe)
                    context.commit("setBoardList", res.data.boardList)
                    context.commit("setIssueList", res.data.issueList)
                    context.commit("setScheduleList", res.data.calendarList)
                    context.commit("setProgress", res.data.ganttList)
                    context.commit("setGitRepo", res.data.git.gitRepo)

                    const result = res.data.git.gitRepo.substring(0, res.data.git.gitRepo.lastIndexOf("/")) + "/commits"
                    axios.get(result, {
                        headers: {
                            Authorization: `token ${API_KEY}`
                        }
                    })
                        .then(git => {
                            context.state.commitList = []
                            let i = 0
                            git.data.forEach(item => {
                                if(i > 6) {
                                    return false
                                }
                                const obj = {
                                    name: item.commit.author.name,
                                    message: item.commit.message,
                                    url: item.html_url
                                }
                                context.state.commitList.push(obj)
                                i++
                            })
                            this.repo = context.state.gitRepo
                        })

                })
        }
    }
}

export default dashBoard