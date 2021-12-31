import moment from "moment"
import axios from "axios"

const git = {
    namespaced : true,
    state(){
        return {
            origin: {
                fileName: '',
                content : '',
                nickname : '윤주원',
                startDate : moment().format('YYYY-MM-DD HH:mm'),
                currentTime : '오늘',
                state : '버그',
            },
            realIssue : '',
            decodeData : '',
            selectedFileName : '',
            selectedFileSize : '',
            insertedContent : '',
            maxLineNum : '',
            memInfo : '',
        }
    },
    mutations :{
        setDecodeData(state, data){
            state.decodeData = data
        },
        getDecodeData(state){
            return state.decodeData
        },
        setSelectedFileName(state, data){
            state.selectedFileName = data
        },
        setInsertedContent(state, data){
            state.insertedContent = data
        },
        setIssueDate(state, data){
            state.realIssue = data
        },
        setSelectedFileSize(state, data){
            let byte = function formatBytes(data, decimals = 2) {
                if (data === 0) return '0 Bytes';
                const k = 1024;
                const dm = decimals < 0 ? 0 : decimals;
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                const i = Math.floor(Math.log(data) / Math.log(k));
                return parseFloat((data / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            }
            state.selectedFileSize = byte(data)
        },
        setMaxLineNum(state, data){
            state.maxLineNum = data + ' lines  |'
        },
        setMemInfo(state, data){
            state.memInfo = data
        },
    },

    actions:{
        getMemInfo(context, t){
            const url = 'gitAndIssue/getInfo'
            const token = t
            axios.post(url, null, {
                params : {
                    token : token
                }
            })
                .then( r => {
                    context.commit('setMemInfo', r.data)
                    this.commit('socket/setMemInfo_Socket', r.data)
                })
        },
    },

}

export default git;