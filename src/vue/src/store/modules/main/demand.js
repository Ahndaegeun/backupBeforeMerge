import axios from 'axios';
import jsPDF from "jspdf";
// import moment from 'moment'
import autoTable from "jspdf-autotable";
import malgun from "@/assets/malgunBase64.js"
const demand = {
    namespaced: true,
    state: {
        projectName : "",
        modifiedDate : "",
        checkedArr : [],
        checkedAll : false,
        storeDemandIdx : "",
        sideBar : "false",
        columns : [
            {
                name : "chk",
                prop : "chk",
                size : 35
            },
            {
                name : "No",
                prop : "no",
                size : 50
            },
            {
                name : "카테고리",
                prop : "category",
                size : 130
            },
            {
                name : "요구사항 ID",
                prop : "demandId",
                size : 150
            },
            {
                name : "요구사항 명",
                prop : "demandName",
                size : 200
            },
            {
                name : "요구사항 상세 설명",
                prop : "demandDetail",
                size: 700
            },
            {
                name : "요청자(요청부서)",
                prop : "requester",
                size : 300
            },
            {
                name : "비고",
                prop : "remark",
            }

        ],
        rows : [],
    },
    mutations: {

        addRow(state) {
            state.rows.push({
                chk : "",
                demand: {
                    project : {
                        prjctIdx : sessionStorage.getItem("project")
                    }
                },
                demandCnIdx : "",
                demandCnNum : "",
                demandCnSe : "",
                demandCnId : "",
                demandCnNm : "",
                demandCnDetail : "",
                demandCnRequstNm : "",
                demandCnRm : "",

            })
        },

        save(state){
            const arr = [];
            for(let item of state.rows) {
                arr.push({...item});
            }
            axios.post('/demand/postRows', {
                params: arr
            })
        },
        load(state){
            let sessionIdx = sessionStorage.getItem("project");
            axios.post('/demand/load',  {
                idx : sessionIdx
            }).then(res => {
                state.rows = []
                const dateForm = res.data[0].demand.demandReviseDate.split('T')
                state.modifiedDate = `${dateForm[0]} ${dateForm[1]}`
                for (const resKey in res.data) {
                    state.rows.push(res.data[resKey])
                }
            })
        },
        uploadFile(state){
            let sessionIdx = sessionStorage.getItem("project")
            if(confirm("업로드 시 기존 요구사항 내용이 삭제됩니다. 진행하시겠습니까?") === true){
                const frm = new FormData();
                let uploadFile = document.getElementById("uploadFile");

                frm.append("uploadFile", uploadFile.files[0]);
                frm.append('demandIdx', sessionIdx);
                axios.post('/demand/importDocument', frm, {
                    headers : {
                        'Content-Type' : 'multipart/form-data'
                    }
                }).then(() =>{
                    axios.post('/demand/load', {
                        idx : sessionIdx
                    }).then(res => {
                        state.rows = [];
                        for (const resKey in res.data) {
                            state.rows.push(res.data[resKey])
                        }
                    })
                })
            } else{
                alert("취소되었습니다.")
            }
        },
        down(state, event){
            let input = event.target.value;
            if(input === "Excel") {
                axios({
                    url: '/demand/downDocument',
                    method: 'POST',
                    responseType: 'blob',
                    data: {
                        "idx" : sessionStorage.getItem("project"),
                        "prjctNm" : state.rows[0].demand.project.prjctNm
                    }
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', state.projectName + ' demand.xlsx');
                    document.body.appendChild(link);
                    link.click();
                });
            } else if(input === "PDF"){
                const doc = new jsPDF('l', 'mm', 'a4');
                const font = malgun.malgun;
                doc.addFileToVFS('malgun.ttf', font);
                doc.addFont('malgun.ttf', 'malgun', 'normal');
                doc.setFont('malgun');
                const data = [];
                for(let i = 0; i < state.rows.length; i++){
                    const obj = [];
                    obj[i] = [
                        state.rows[i].demandCnNum,
                        state.rows[i].demandCnSe,
                        state.rows[i].demandCnId,
                        state.rows[i].demandCnNm,
                        state.rows[i].demandCnDetail,
                        state.rows[i].demandCnRequstNm,
                        state.rows[i].demandCnRm
                    ]
                    data.push(obj[i])
                }
                autoTable(doc,{
                    styles : { font : "malgun", fontStyle : "normal"},
                    head : [['No', 'Category', 'Demand ID', 'Demand Name', 'Demand Description',
                        'Requester', 'Remark']],
                    body : data,
                })
                doc.save('test.pdf');
            }

            const sel = document.querySelector('#export-select');
            sel.value = 'none'

        },
        clickAllCheckBox(state){
            let headCheckBox = document.querySelector('.headCheckBox');
            let allCheckBox = document.querySelectorAll('.demand-table-chk');

            state.checkedAll = headCheckBox.checked

            if(state.checkedAll) {
                allCheckBox.forEach(ele => {
                    ele.checked = true
                })
                state.rows.forEach(ele => {
                    state.checkedArr.push({...ele})
                })
            } else {
                allCheckBox.forEach(ele => {
                    ele.checked = false
                })
                state.checkedArr = []
            }
        },
        clickCheckBox(state, item){
            if(state.checkedAll) {
                state.checkedAll = false
            }

            let isExist = false
            state.checkedArr.forEach(ele => {
                if(ele.demandCnIdx === item) {
                    isExist = true
                }
            })

            if(!isExist){
                const temp = {
                    demandCnIdx : item,
                    demand : {
                        demandIdx: state.rows[0].demand.demandIdx
                    }
                }
                state.checkedArr.push(temp);
            } else {
                for(let i = 0; i < state.checkedArr.length; i++) {
                    if(state.checkedArr[i].demandCnIdx === item) {
                        state.checkedArr.splice(i, 1)
                    }
                }
            }

            if(state.checkedArr.length === state.rows.length) {
                let headCheckBox = document.querySelector('.headCheckBox');
                state.checkedAll = true
                headCheckBox.checked = true
            }
        },
        deleteRow(state){
            let sessionIdx = sessionStorage.getItem("project")
            if(confirm("삭제하시겠습니까?") === true){
                if(state.checkedArr.length === 0) {
                    alert("삭제할 행이 없습니다.")
                    return
                }
                const arr = []
                for(let item of state.checkedArr) {
                    arr.push({...item});
                }
                axios.post('/demand/deleteRows', {
                    params: arr
                }).then(() => {
                    axios.post('/demand/load', {
                        idx : sessionIdx
                    }).then(res => {
                        state.rows.splice(0, state.rows.length);
                        for (const resKey in res.data) {
                            state.rows.push(res.data[resKey])
                        }
                        let headCheckBox = document.querySelector('.headCheckBox');
                        state.checkedArr = []
                        headCheckBox.checked = false
                        let allCheckBox = document.querySelectorAll('.demand-table-chk');
                        allCheckBox.forEach(ele => {
                            ele.checked = false;
                        })

                    })
                })
            }else{
                alert("취소되었습니다.");
            }
        },

        getSideBar(state){
            state.sideBar = state.rows !== null;
        }


    },
    actions: {

    },
    getters: {

    },

}

export default demand