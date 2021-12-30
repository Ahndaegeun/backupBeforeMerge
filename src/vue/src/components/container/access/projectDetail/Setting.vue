<template>
  <div class="main-container">
    <div class="setting-container">
      <div class="name-component">
        <Name/>
      </div>
      <div class="date-component">
        <Date/>
      </div>
      <div class="addMember-component" v-if="this.$store.state.setting.clickState === true">
        <AddMember/>
      </div>
      <div class="member-component">
        <Member/>
      </div>
      <div class="button-component">
        <Buttons/>
      </div>
    </div>
  </div>
</template>
<script>
import {mapMutations} from "vuex";
import AddMember from '@/components/component/acess/projectDetail/setting/AddMember.vue'
import Name from '@/components/component/acess/projectDetail/setting/Name.vue'
import Date from '@/components/component/acess/projectDetail/setting/Date.vue'
import Member from '@/components/component/acess/projectDetail/setting/Member.vue'
import Buttons from '@/components/component/acess/projectDetail/setting/Buttons.vue'


export default {
  components: {
    Name,
    Date,
    AddMember,
    Member,
    Buttons,
  },

  methods: {
    ...mapMutations({
      load: "setting/loadData",
      isRoleMatch: "setting/isRoleMatch",
      getUserInfo: "setting/getUserInfo"
    })
  },

  mounted() {
    this.load();
    this.getUserInfo();
  }
}

</script>

<style scoped>
.setting-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100vw;
  height: calc(100vh - 70px);
  background-color: #16161A;
}

.setting-container::-webkit-scrollbar {
  display: none;
}

.name-component {
  width: 60vw;
  height: 6%;
}

.date-component {
  width: 60vw;
  height: 12%;
}

.addMember-component {
  width: 60vw;
  height: 30%;

}

.member-component {
  width: 60vw;
  height: 26%;

}

.button-component {
  width: 60vw;

}

</style>