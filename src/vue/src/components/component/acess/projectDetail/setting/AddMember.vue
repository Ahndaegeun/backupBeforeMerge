<template>
  <div class="main-div">
    <div class="main-left-div">
      <div class="main-start-text"><h3>멤버 추가</h3></div>
      <ul class="select-member-list" id="select-member-list">
        <li v-for="(item, index) in this.$store.state.setting.selectMemberList" :key="index" class="select-member-info"
            :id="`select-member-info${index}`">
          <div class="select-member-image">
            <img v-if="item.memImg === '' || item.memImg === null || item.memImg === undefined" class="member-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAYAAABG1c6oAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADRSURBVHgBrZQLDYMwEIb/LhMADnAwCasUJOAAHMzCLEwBm4M5AAfg4HYXWNYM+qRfck3T9L70cS3ggIg0R88x0YL0a6TAiS3ZaWNlNfnRMcI+QNjv5SqLkOBnVkqV/4Mn22T4KfYGbcI3/LwQylouPmrEwAmdQ9YhBVrK57lKprWvXTnKI5SD1/hdwCjBtzsicmXfJ2etwaAz5EkVhRW1Ka5csoHiGTbSAzJTWpjCOx3nJi5Fy3IH5KGUp9cgH40IL8jHVbY8wfJzJDCfuXkgIx+zEByVvJWBBgAAAABJRU5ErkJggg==">
            <img v-else :src="item.memImg" class="member-image"/>
          </div>
          <div class="select-member-text">
            {{item.memNick}}
            {{item.memTag}}
          </div>&nbsp;
          <div class="select-member-job">
            <select @change="setMemberRole(item, $event)">
              <option value="none" selected>Role</option>
              <option v-for="(a, i) in this.$store.state.setting.roleList" :key="i">{{a}}</option>

            </select>
          </div>
          <div class="cancel-btn">
            <button :id="`select-member-insert-cancel-btn${index}`"
                    @click = "insertCancel(item, index),
                    leftTextHideFunction()" >X</button>
          </div>
        </li>
      </ul>
      <div id="plzClick" class="plzClick">
        우측에서 검색 후 추가할 멤버를 클릭해 주세요
      </div>
      <div>
        <button class="select-member-insert-btn" @click="addBtn">멤버 추가</button>
      </div>
    </div>

    <div class="main-right-div">
      <input type="text" class="search-input" id="search-member" v-model="searchKeyword" @keyup="searchName(searchKeyword)">
      <ul class="search-member-result-list">
        <li :id="`selectMember-${index}`" @click="searchMemberSelect(item, index),
             leftTextHideFunction()" v-for="(item, index) in
             this.$store.state.setting.searchMemberList" :key="index" class="search-member-result">
          <div class="search-member-result-image">
            <img v-if="item.memImg === '' || item.memImg === null || item.memImg === undefined" class="member-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAYAAABG1c6oAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADRSURBVHgBrZQLDYMwEIb/LhMADnAwCasUJOAAHMzCLEwBm4M5AAfg4HYXWNYM+qRfck3T9L70cS3ggIg0R88x0YL0a6TAiS3ZaWNlNfnRMcI+QNjv5SqLkOBnVkqV/4Mn22T4KfYGbcI3/LwQylouPmrEwAmdQ9YhBVrK57lKprWvXTnKI5SD1/hdwCjBtzsicmXfJ2etwaAz5EkVhRW1Ka5csoHiGTbSAzJTWpjCOx3nJi5Fy3IH5KGUp9cgH40IL8jHVbY8wfJzJDCfuXkgIx+zEByVvJWBBgAAAABJRU5ErkJggg==">
            <img v-else :src="item.memImg" class="member-image"/>
          </div>
          <div class="search-member-result-text">
            {{item.memNick}}&nbsp;
            {{item.memTag}}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>


import {mapMutations} from "vuex";
import axios from "axios";


export default {
  data() {
    return{
      receivedData : false,
      searchKeyword : "",
      selectMember : [

      ],
      searchMember : [
      ],
    }
  },


  methods: {
    ...mapMutations({
      addBtn : 'setting/addBtn'
    }),

    setMemberRole(item, event){
      let position = event.target.value;

      if(position === 'PM'){
        alert("PM은 추가할 수 없습니다.")
      }else{
        const tempRole = position
        item.tempRole = tempRole;
      }

    },

    searchName(searchKeyword){
      axios.post('/setting/searchProjectMember', {
        searchKeyword : searchKeyword
      }).then((res) => {
        this.$store.state.setting.searchMemberList = [];
        this.$store.state.setting.searchMemberList = res.data;
      })

    },

    leftTextHideFunction(){
      if((Object.keys(this.$store.state.setting.selectMemberList).length) >0){
        document.getElementById('plzClick').style.display = 'none';
      } else{
        document.getElementById('plzClick').style.display = 'block';
      }
    },
    insertCancel(item,index){

      this.$store.state.setting.searchMemberList.push(item);
      this.$store.state.setting.selectMemberList.splice(index, 1);
    },
    searchMemberSelect(item, index){
      this.$store.state.setting.searchMemberList.splice(index, 1)
      this.$store.state.setting.selectMemberList.push(item);
    }
  },


  mounted() {
    this.leftTextHideFunction();

  },


}
</script>

<style scoped>
.main-div{
  border-radius : 5px;
  padding : 15px;
  background-color : #2C2F3B;
  display : flex;
  justify-content : space-around;
  align-items : flex-start;
  color : white;
  width: 100%;
  height: 100%;


}
.main-left-div{
  margin-left: 20px;
  display : flex;
  justify-content: space-between;
  align-items : stretch;
  flex-direction : column;
  width : 50%;
  height : 100%;
}

.main-right-div{
  width : 50%;
  height: 100%;
  margin-left: 20px;
  overflow: hidden;
}

.select-member-info{
  display : flex;
  justify-content : space-around;
  margin : 4px;
  padding : 5px;
  white-space:nowrap;
}

.select-member-image{
  border-radius: 70%;
  overflow: hidden;
  margin-right: 10px;
}
.member-image{
  width: 20px;
  height : 20px;
}

.search-member-result-image{
  border-radius: 70%;
  overflow: hidden;
  margin-right: 10px;
}

.plzClick{
  margin-bottom: 30px;
  font-size: 16px;
}


.select-member-job *{
  color : #FF8906;
  background-color : #2C2F3B;
  font-size: 16px;
  -o-appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  position: relative;
}

.search-input{
  background-color : #414556;
  border : 0;
  border-radius : 5px;
  width : 170px;
  height : 30px;
  margin : 10px;
  color: #fff;
  outline: none;
}
.search-member-result-list{
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  display: grid;
  grid-template-columns: 1fr 1fr ;
  grid-auto-rows: 30px;
  height: 70%;
  font-size : 20px;

}

.search-member-result-list::-webkit-scrollbar{
  display: none;
}
.search-member-result{
  display : flex;
  color : white;
  padding : 3px;
  cursor: Pointer;
}
.select-member-insert-btn{
  border-radius: 5px;
  width : 80px;
  height : 30px;
  background-color : #FF8906;
  margin-top : 5px;
  color: white;
}

.select-member-list{
  display : flex;
  flex-direction: column;
  justify-content : flex-start;
  margin-bottom : auto;
  align-items: baseline;
  overflow-x: hidden;
  overflow-y: auto;
}

.select-member-list::-webkit-scrollbar{
  display: none;
}

.main-start-text{
  margin: 10px;
  font-size : 22px;
}

</style>