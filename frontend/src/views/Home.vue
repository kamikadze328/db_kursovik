<template>
 <div class="home">
  <AddNewBreakdown :with-limit="true"/>
  <div class="list-last-breakdowns-block">
   <BreakdownsList :with-limit="true"/>
  </div>
 </div>
</template>

<script>

import BreakdownsList from "@/views/BreakdownsList";
import {mapState} from 'vuex';
import AddNewBreakdown from "@/views/AddNewBreakdown";

export default {
 name: 'Home',
 components: {AddNewBreakdown, BreakdownsList},
 computed: {
  ...mapState(['spaceships'])
 },
 methods: {
  addNewBreakdown(e) {
   console.log('new breakdown')
   e.preventDefault()
  }
 },
}
</script>

<style scoped>

.home > * {
 width: 60%;
 margin: 10px auto 40px auto;
 text-align: left;
}
</style>
