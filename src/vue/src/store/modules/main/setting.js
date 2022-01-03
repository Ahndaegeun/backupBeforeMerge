import axios from "axios";

const setting = {
  namespaced: true,
  state: {

    userInfo : "",
    clickState  : false,
    projectName : '',
    roleList : ['PM','PL','DA','TA','AA','UA','BA','EA','SA'],
    projectDate : {},
    projectData : {},
    userInputDate : {
      startDate : '',
      endDate : ''
    },
    roleMatch : {
      PM : false,
      PL : false,
      DA : false,
      TA : false,
      AA : false,
      UA : false,
      BA : false,
      EA : false,
      SA : false
    },
    searchMemberList : [],
    selectMemberList : [],
    projectMemberList : []
  },
  mutations: {
    changeClickState(state){
      if(state.clickState === false){
        state.clickState = true;
      } else{
        state.clickState = false;
      }
    },

    loadData(state){
      let idx = sessionStorage.getItem("project")
      axios.post('/setting/loadProjectMember', {
        prjctIdx : idx
      }).then(res => {
        for (const resKey in res.data) {
          state.projectMemberList.push(res.data[resKey]);
        }
        for (let i = 0; i < state.projectMemberList.length; i++) {
          const tempRoleData = {
            PM : false,
            PL : false,
            DA : false,
            TA : false,
            AA : false,
            UA : false,
            BA : false,
            EA : false,
            SA : false
          }
          state.projectMemberList[i].tempRoleData = tempRoleData

          const loadRole = state.projectMemberList[i].prjctMemRole.split(',');

          for (let j = 0; j < loadRole.length; j++) {
            if(loadRole[j] === 'PM'){
              state.projectMemberList[i].tempRoleData.PM = true;
            } else if(loadRole[j] === 'PL'){
              state.projectMemberList[i].tempRoleData.PL = true;
            }else if(loadRole[j] === 'DA'){
              state.projectMemberList[i].tempRoleData.DA = true;
            }else if(loadRole[j] === 'TA'){
              state.projectMemberList[i].tempRoleData.TA = true;
            }else if(loadRole[j] === 'AA'){
              state.projectMemberList[i].tempRoleData.AA = true;
            }else if(loadRole[j] === 'UA'){
              state.projectMemberList[i].tempRoleData.UA = true;
            }else if(loadRole[j] === 'BA'){
              state.projectMemberList[i].tempRoleData.BA = true;
            }else if(loadRole[j] === 'EA'){
              state.projectMemberList[i].tempRoleData.EA = true;
            } else{
              state.projectMemberList[i].tempRoleData.SA = true;
            }
          }
          state.projectMemberList[i].roleList = loadRole;
        }
        state.projectDate.startDate = state.projectMemberList[0].project.prjctStartDate;
        state.projectDate.endDate = state.projectMemberList[0].project.prjctEndDate;
      })

      axios.post('/setting/loadProject', {
        prjctIdx : sessionStorage.getItem("project")
      }).then(res => {
        state.projectData = res.data;
      })
    },

    isRoleMatch(state){
      alert("gogo!!")
      for(let i in state.projectMemberList){
        for(let j in state.projectMemberList[i].roleList){
          for(let k in state.roleList){
            if(state.projectMemberList[i].roleList[j] ===  state.roleList[k]){
              // this.$store.state.setting.projectMemberList[i].role.push(this.$store.state.setting.roleList[k]);
              document.getElementById(state.roleList[k] + '-span' + i).style.color = "red";
            }
          }
        }
      }
    },

    clickModifyBtn(state){
      state.clickState = true;
    },

    addBtn(state){
      const arr = [];
      for(let item of state.selectMemberList) {
        if(item.tempRole == null){
          alert("정보를 제대로 입력해주세요.")
          break;
        }else{
          const obj = {
            member : item,
            project : state.projectData,
            prjctMemRole : item.tempRole
          };
          arr.push(obj);
        }
        axios.post('/setting/addProjectMember', {
          params: arr
        }).then(res => {
          res.data.forEach(item => {
            this.commit('setting/makeRoleList', item);
            // state.projectMemberList.push(item)
          })
          state.projectMemberList = [];
          this.commit('setting/loadData');
          state.selectMemberList = [];
        })
      }
    },

    getUserInfo(state){
      let projectIdx = sessionStorage.getItem("project")
      let userToken = sessionStorage.getItem("token");
      axios.post('/access/checkProjectMember', {
        token : userToken,
        projectIdx : projectIdx
      }).then(res =>{
        state.userInfo = res.data;
      })
    },

    makeRoleList(state, item) {
      const tempRoleData = {
        PM : false,
        PL : false,
        DA : false,
        TA : false,
        AA : false,
        UA : false,
        BA : false,
        EA : false,
        SA : false
      }
      const loadRole = item.prjctMemRole.split(',');

      for (let j = 0; j < loadRole.length; j++) {
        if(loadRole[j] === 'PM'){
          tempRoleData.PM = true;
        } else if(loadRole[j] === 'PL'){
          tempRoleData.PL = true;
        }else if(loadRole[j] === 'DA'){
          tempRoleData.DA = true;
        }else if(loadRole[j] === 'TA'){
          tempRoleData.TA = true;
        }else if(loadRole[j] === 'AA'){
          tempRoleData.AA = true;
        }else if(loadRole[j] === 'UA'){
          tempRoleData.UA = true;
        }else if(loadRole[j] === 'BA'){
          tempRoleData.BA = true;
        }else if(loadRole[j] === 'EA'){
          tempRoleData.EA = true;
        } else{
          tempRoleData.SA = true;
        }
      }
      item["roleList"] = loadRole
      item["tempRoleData"] = tempRoleData
    },
  },
  actions: {

  },

}

export default setting