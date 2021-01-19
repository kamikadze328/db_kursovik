<template>
  <div class="header">
    <div>Кнопка?</div>
    <div>
      <router-link :to="{name: 'Home'}"><img class="logo" src="@/assets/logo.png" alt="Vue logo"/></router-link>
    </div>
   <div class="open-all-filters">
    <router-link :to="{name: 'AdminPanel'}">Панель администратора</router-link>
   </div>
  </div>
</template>

<script>
export default {
  name: "Header"
}
</script>

<style scoped>
.header{
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: center;
  border-bottom: 1px solid #eaecef;
}
.header *{
  vertical-align: middle;
  display: table-cell;
  margin: auto auto;
}
.logo{
  height: 35px;
}
.open-all-filters{
  margin-left: auto;
  width: 60%;
}
</style>