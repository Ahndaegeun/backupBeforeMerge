<template>
  <h1>Filter</h1>

  <ul>
    <li v-for="item in this.$store.state.scheduler.filters" :key="item" >
      <input v-if="item.isClick === true" checked type="checkbox" :id="item.filterName" @click="checkBoxClick(item)">
      <input v-else-if="item.isClick === false" type="checkbox" :id="item.filterName" @click="checkBoxClick(item)">
      <label :for="item.filterName">{{item.koName}}</label>
    </li>
  </ul>
</template>

<script>
import { mapMutations} from 'vuex'

export default {
  methods : {
    ...mapMutations({
      checkBoxClick : 'scheduler/checkBoxClick',
    }),
  },
}
</script>

<style>

</style>