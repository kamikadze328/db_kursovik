<template>
 <div>
  <AdmitPanelOverTable v-model="inputText"
                       :with-green-button="true"
                       :with-red-button="true"
                       green-button-text="Добавить корабль"
                       red-button-text="Удалить"
                       search-by-place-holder="названию"
                       with-yellow-button="true"
                       yellow-button-text="Изменить"/>
  <table>
   <thead>
   <tr>
    <th>ID</th>
    <th>Название</th>
    <th>Домашняя планета</th>
    <th>Произведён на</th>
    <th>Текущая планета</th>
   </tr>
   </thead>
   <tbody>
   <tr v-for="ship in spaceships" :key="ship.id">
    <td>{{ ship.id }}</td>
    <td>{{ ship.name }}</td>
    <td>{{ ship.homePlanet }}</td>
    <td>{{ ship.madeAtPlanet }}</td>
    <td>{{ ship.currentPlanet }}</td>
   </tr>
   </tbody>
  </table>
 </div>
</template>

<script>
import AdmitPanelOverTable from "@/components/AdmitPanelOverTable";
import {mapState} from 'vuex';

export default {
 name: "Spaceships",
 components: {AdmitPanelOverTable},
 data() {
  return {
   inputText: ''
  }
 },
 computed: {
  ...mapState(['spaceships'])
 }
}
</script>

<style scoped>

</style>