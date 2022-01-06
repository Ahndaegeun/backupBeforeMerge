import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client'
import moment from 'moment'
import axios from 'axios'
moment.locale('ko')


const socket = {
    namespaced : true,
    state(){
        return{
            // alarm var
            alarmState : '',
            recvList: [],

            // chatting var
            id : "",
            text: "",

            textArea_text : '',

            alarmColor : '',
            sendChat : {
                id : 'default',
                text : 'default',
                date : 'default',
                originDate : '',
                sumOriginDate : '',
                // 이미지는 projectList(projects)에서 따로 받아와야한다
                img : '',
            },
            receivedChat : {
                id : 'received',
                text : 'received',
                date : 'received',
                img : '',
                prjctIdx : '',
            },
            alarmCnt: 0,
            ganttAlarmCnt: 0,
            projectBoardAlarmCnt: 0,
            issueAlarmCnt: 0,
            enterProjectAlarmCnt: 0,
            kanbanAlarmCnt: 0,

            chatCnt : 0,
            receiveChatCnt : 0,
            textAreaCnt : 0,
            s_chatData : {
                roomId: "0",
                isMini: false,
                content: [
                    // {
                    //     id: "kade",
                    //     text: "안대근입니다",
                    //     img: "con1.jpg",
                    //     date: "16:30",
                    // },
                ],
            },
            callDateLineCmt : 0 ,
            memInfo_socket : '',
            alarmContent : {},
            receiveAlarmData  : '',
            receiveGanttAlarmData : '',
            receiveProjectBoardAlarmData : '',
            receiveIssueAlarmData: '',
            receiveEnterProjectAlarmData: '',
            receiveKanbanAlarmData: '',

            projectArr: {}
        }
    },
    mutations : {
        setMemIdx(state, item) {
            const arr = {
                memIdx: item.idx,
                memNick: item.nick,
                alarmCategory: "enterProject",
                prjctIdx: sessionStorage.getItem("project")
            }
            state.projectArr = arr
        },
        setReceiveAlarmData(state, arr){
            state.receiveAlarmData = arr
        },
        setReceiveGanttAlarmData(state, arr){
            state.receiveGanttAlarmData = arr
        },
        setReceiveProjectBoardAlarmData(state, arr){
            state.receiveProjectBoardAlarmData = arr
        },
        setReceiveIssueAlarmData(state, arr) {
            state.receiveIssueAlarmData = arr
        },
        setReceiveKanbanAlarmData(state, arr) {
            state.receiveKanbanAlarmData = arr
        },
        setReceiveEnterProjectAlarmData(state, arr) {
            state.receiveEnterProjectAlarmData = arr
        },
        setSendChatting(state, arr){
            const temp = {
                // id는 꼭 로그인한 id나 idx로 값을 입력해줘야함
                id : arr.id,
                text : arr.text,
                date : moment().format('YYYY-MM-DD')+'T'+ arr.date,
                img : arr.img,
                originDate : moment().format('YYYY-MM-DD')+' '+ arr.date,
            }
            this.commit('socket/pushToS_chatDataContent', temp)
        },
        resetSendChatValues(state){
            state.sendChat.id = ''
            state.sendChat.text = ''
            state.sendChat.date = ''
            state.sendChat.img = ''
        },
        setReceivedChatting(state,arr){
            state.receivedChat.id = arr.id
            state.receivedChat.text = arr.text
            state.receivedChat.date = arr.date
            state.receivedChat.prjctIdx = arr.prjctIdx
            state.receivedChat.img = arr.textAreaText
            state.receivedChat.idx = arr.idx
            if(sessionStorage.getItem('project') != arr.prjctIdx ) return

            const temp = {
                // id는 꼭 로그인한 id나 idx로 값을 입력해줘야함
                id : arr.memNick,
                idx : arr.memIdx,
                text : arr.text,
                date : moment().format('YYYY-MM-DD')+'T'+ arr.date,
                img : arr.textAreaText,
                originDate : moment().format('YYYY-MM-DD')+' '+ arr.date,
                prjctIdx : arr.prjctIdx,
            }
            this.commit('socket/pushToS_chatDataContent', temp)
        },
        setTextArea_Text(state, text){
            state.textArea_text = text
        },
        increaseAlarmCnt(state){
            state.alarmCnt++
        },
        increaseGanttAlarmCnt(state){
            state.ganttAlarmCnt++
        },
        increaseProjectBoardAlarmCnt(state){
            state.projectBoardAlarmCnt++
        },
        increaseChatCnt(state){
            state.chatCnt++
        },
        increaseReceiveChatCnt(state){
            state.receiveChatCnt++
        },
        increaseTextAreaCnt(state){
            state.textAreaCnt++
        },
        increaseCallDateLineCnt(state){
            state.callDateLineCmt++
        },
        increaseIssueAlarmCnt(state) {
            state.issueAlarmCnt++
        },
        increaseEnterProjectAlarmCnt(state) {
            state.enterProjectAlarmCnt++
        },
        increaseKanbanAlarmCnt(state) {
            state.kanbanAlarmCnt++
        },
        setIdValue(state, value){
            state.sendChat.id = value
        },
        setTextValue(state, value){
            state.text = value
        },
        setMemInfo_Socket(state, arr){
            state.memInfo_socket = arr
        },
        alarm(state,arr){
            const {color} = arr

            if(arr !== null){
                if(this.stompClient && this.stompClient.connected){
                    const msg = {
                        alarm : color,
                        memNick : arr.memberInfo.memNick,
                        memIdx : arr.memberInfo.memIdx,
                        prjctIdx : arr.prjctIdx,
                        date : arr.schedulerData.data.calStartDate.replace('T', ' '),
                        alarmCategory : arr.alarmCategory,
                        calCategory : arr.schedulerData.data.calColor,
                    }
                    this.stompClient.send("/alarm", JSON.stringify(msg), {})
                }
            }// color if
        },// color function end
        ganttAlarm(state, arr){
            if(arr != null){
                if(this.stompClient && this.stompClient.connected){
                    const msg = {
                        memNick : arr.memNick,
                        memIdx : arr.memIdx,
                        prjctIdx : arr.prjctIdx,
                        text : arr.gtTitle,
                        date : arr.gtPriority,
                        alarm : arr.gtState,
                        alarmCategory : arr.alarmCategory,
                    }
                    this.stompClient.send("/alarm", JSON.stringify(msg), {})
                }
            }
        },
        projectBoardAlarm(state, arr){
            if(arr != null){
                if(this.stompClient && this.stompClient.connected){
                    const msg = {
                        memIdx : arr.member.memIdx,
                        memNick : arr.member.memNick,
                        alarmCategory : 'projectBoard',
                        alarm : 'projectBoard',
                        prjctIdx : sessionStorage.getItem("project"),
                        // 작성자
                    }
                    this.stompClient.send("/alarm", JSON.stringify(msg), {})
                }
            }
        },
        issueAlarm(state, arr) {
            if(arr != null){
                if(this.stompClient && this.stompClient.connected){
                    const msg = {
                        memIdx: arr.member.memIdx,
                        alarm: 'issue',
                        alarmCategory: 'issue',
                        prjctIdx: sessionStorage.getItem("project"),
                        memNick: arr.member.memNick,
                        text: arr.issueGitFile
                    }
                    this.stompClient.send("/alarm", JSON.stringify(msg), {})
                }
            }
        },
        kanbanAlarm(state, arr) {
            if(arr !== null) {
                if (this.stompClient && this.stompClient.connected) {
                    const msg = {
                        memIdx: arr.memIdx,
                        alarm: 'kanban',
                        alarmCategory: 'kanban',
                        prjctIdx: sessionStorage.getItem("project"),
                        memNick: arr.memNick,
                        text : arr.text,
                    }
                    this.stompClient.send("/alarm", JSON.stringify(msg), {})
                }
            }
        },
        enterProjectAlarm(state) {
            if(this.stompClient && this.stompClient.connected){
                const msg = {
                    memIdx: state.projectArr.memIdx,
                    alarm: 'enterProject',
                    alarmCategory: 'enterProject',
                    prjctIdx: sessionStorage.getItem("project"),
                    memNick: state.projectArr.memNick,
                }
                this.stompClient.send("/alarm", JSON.stringify(msg), {})
            }
        },
        sendMessage(state, arr) {
            // store에 값 저장함
            this.commit('socket/send', arr)
            // 소켓에 데이터 전송 후 store 에 저장된 값을 초기화함
            this.dispatch('socket/callAxiosForChatLog', arr)
        }, // sendMessageFunction end

        send(state, arr) {
            if(this.stompClient && this.stompClient.connected) {
                const msg = {
                    memNick: arr.id.memNick,
                    memIdx : arr.id.memIdx,
                    text: arr.text,
                    date : arr.date,
                    prjctIdx : arr.prjctIdx,
                    textAreaText: arr.img
                }
                this.stompClient.send("/receive", JSON.stringify(msg), {})
            }
        },// send function end

        sendTextArea(state, text){
            if(this.stompClient && this.stompClient.connected){
                let arr_textAreaText = {
                    textAreaText : '',
                }
                arr_textAreaText.textAreaText = text
                state.textArea_text = text
                this.stompClient.send('/textArea', JSON.stringify(arr_textAreaText), {})
            }
            // this.textArea_text = ''
        },

        pushToS_chatDataContent(state, arr){
            const {originDate, date} = arr

            let sumOriginDate = originDate.split("-")[0] + originDate.split("-")[1] + originDate.split("-")[2].substring(0,2)
            arr.date = moment(date).format('LT')
            arr.sumOriginDate = sumOriginDate
            arr.momentedDate = moment(originDate).format('LL') +' '+ moment(originDate).format('dddd')

            // 렌더링 시 껍데기 데이터에 line true값 추가
            if( state.s_chatData.content.length > 0 ){
                const Index = state.s_chatData.content.length-1
                if(arr.sumOriginDate !== undefined){
                    if(state.s_chatData.content[Index].sumOriginDate !== arr.sumOriginDate){
                        arr.line = true
                    }
                }
            }
            state.s_chatData.content.push(arr)
        },
        // select 쿼리 후에 line true값 추가
        findDifferentOriginDate(state){
            for(let i = 0; i < state.s_chatData.content.length-1; i++){
                if(state.s_chatData.content[i].sumOriginDate !== state.s_chatData.content[i+1].sumOriginDate){
                    state.s_chatData.content[i+1].line = true
                }
            }
        },

        disConnect(){
            if(this.stompClient != null){
                this.stompClient.disconnect()
            }
        },

    },
    actions : {
        connect(state){
            // const serverURL = "http://localhost:8099/ws"
            const serverURL = "http://kanboo.site/ws"
            let socket = new SockJS(serverURL)
            this.stompClient = Stomp.over(socket)
            this.stompClient.debug = () => {}
            this.stompClient.connect( {}, () => {
                    this.stompClient.connected = true
                    if(state.state.projectArr !== null) {
                        this.commit('socket/enterProjectAlarm')
                    }
                    // subscribe 한 횟수만큼 소켓을 쏘는 버그를 잡아야함
                    this.stompClient.subscribe("/send", res => {
                        let arr = JSON.parse(res.body)
                        const {alarmCategory, alarm, textAreaText, userName, message} = arr

                        if(alarm !== null && alarm !== '' && textAreaText === null){
                            state.alarmState = alarm
                            //알람 내용 담기
                            if(alarmCategory == 'calendar'){
                                this.commit('socket/setReceiveAlarmData', arr)
                                this.commit('socket/increaseAlarmCnt')
                            }
                            if(alarmCategory == 'gantt'){
                                this.commit('socket/setReceiveGanttAlarmData', arr)
                                this.commit('socket/increaseGanttAlarmCnt')
                            }
                            if(alarmCategory == 'projectBoard'){
                                this.commit('socket/setReceiveProjectBoardAlarmData', arr)
                                this.commit('socket/increaseProjectBoardAlarmCnt')
                            }
                            if(alarmCategory == 'issue') {
                                this.commit('socket/setReceiveIssueAlarmData', arr)
                                this.commit('socket/increaseIssueAlarmCnt')
                            }
                            if(alarmCategory == 'enterProject') {
                                this.commit('socket/setReceiveEnterProjectAlarmData', arr)
                                this.commit('socket/increaseEnterProjectAlarmCnt')
                            }
                            if(alarmCategory == 'kanban') {
                                this.commit('socket/setReceiveKanbanAlarmData', arr)
                                this.commit('socket/increaseKanbanAlarmCnt')
                            }

                            // watch들 호출하기
                        }else if(userName !== null && userName !== '' && message !== null && message !== ''){
                            this.commit('socket/setReceivedChatting',arr)
                            this.commit('socket/increaseReceiveChatCnt')
                        }
                    })
                    this.stompClient.unsubscribe("/send")
                },
                () => {
                    this.stompClient.connected = false
                })
        }, // connect function end

        callAxiosForChatLog(state, arr){
            const url = '/socket/insertChatLog'
            const header = null
            //토큰에서 받아오는 memIdx이어야함
            const memIdx = arr.id.memIdx

            axios.post( url, header, {
                params : {
                    chatContentIdx : null,
                    'member.memIdx' : memIdx,
                    'chat.project.prjctIdx' : sessionStorage.getItem("project"),
                    'chat.member.memIdx' : memIdx,
                    chatCn : arr.text,
                    chatCnDate : moment().format('YYYY-MM-DD')+' '+ arr.date,
                }
            })
        },

        callDataOfAllChat(){
            const url = '/socket/selectAllChatLog'
            axios.get( url, {
                params : {
                    token : sessionStorage.getItem("token"),
                    prjctIdx : sessionStorage.getItem("project"),
                }
            }).then( e => {
                const {data} = e
                let tempImg = ''
                for(let i = 0; i < data.chat.length; i++){
                    if(data.chat[i].chat.member.memImg === '' || data.chat[i].chat.member.memImg === null){
                        tempImg ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAYAAABG1c6oAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADRSURBVHgBrZQLDYMwEIb/LhMADnAwCasUJOAAHMzCLEwBm4M5AAfg4HYXWNYM+qRfck3T9L70cS3ggIg0R88x0YL0a6TAiS3ZaWNlNfnRMcI+QNjv5SqLkOBnVkqV/4Mn22T4KfYGbcI3/LwQylouPmrEwAmdQ9YhBVrK57lKprWvXTnKI5SD1/hdwCjBtzsicmXfJ2etwaAz5EkVhRW1Ka5csoHiGTbSAzJTWpjCOx3nJi5Fy3IH5KGUp9cgH40IL8jHVbY8wfJzJDCfuXkgIx+zEByVvJWBBgAAAABJRU5ErkJggg=='
                    }else{
                        tempImg = data.chat[i].chat.member.memImg
                    }
                    const arr = {
                        id : data.chat[i].chat.member.memNick,
                        idx : data.chat[i].chat.member.memIdx,
                        text : data.chat[i].chatCn,
                        img : tempImg,
                        date : data.chat[i].chatCnDate,
                        originDate : data.chat[i].chatCnDate.replace('T', ' '),
                    }
                    this.commit('socket/pushToS_chatDataContent', arr)
                }
                this.commit('socket/findDifferentOriginDate')
            })
        },

    },

}

export default socket;