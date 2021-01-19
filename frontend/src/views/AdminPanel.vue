<template>
 <div class="admin-container">
  <div ref="leftPanel" class="admin-left-panel">
   <div class="left-panel-top">
    <router-link :to="{name:'AdminPanelSpaceships'}">
     Корабли
    </router-link>
    <router-link :to="{name:'AdminPanelPlanets'}">
     Планеты
    </router-link>

   </div>
   <div class="left-panel-bottom">
    <router-link :to="{name: 'Home'}">Главная</router-link>
   </div>
  </div>
  <div class="admin-content">
   <router-view/>
  </div>
 </div>
</template>

<script>
export default {
 name: "AdminPanel",

 mounted() {
  console.log(this.$route.name)
  if (this.$route.name === 'AdminPanel')
   this.$router.push({name: 'AdminPanelSpaceships'})
 },
 beforeRouteEnter(to, from, next) {
  if (to.name === 'AdminPanel')
   next({name: 'AdminPanelSpaceships'})
  else next()
 }
}
</script>

<style scoped>


.component-fade-enter-active, .component-fade-leave-active {
 transition: opacity .2s ease;
}

.admin-container {
 display: flex;
 position: fixed;
 top: 50px;
 height: calc(100% - 50px);
 width: 100%;
}

a, .router-link {
 text-decoration: none;
 font-weight: 600;
}

.admin-left-panel {
 z-index: 10000;
 text-transform: uppercase;
 font-weight: 600;
 font-size: 1.2rem;
 display: flex;
 flex-direction: column;
 justify-content: space-between;
 width: 190px;
 position: relative;
 left: -38px;
 background-color: #d0e3f3;
 height: 100%;
 -webkit-transition: left .2s linear;
 -moz-transition: left .2s linear;
 -ms-transition: left .2s linear;
 -o-transition: left .2s linear;
 transition: left .2s linear;
}

.admin-left-panel a {
 color: #115593;
 padding: 5px 0 5px 7px;
 border-left: 3px solid transparent;
}

.router-link-exact-active {
 border-left: 4px solid #348fe2 !important;
 font-weight: bold;

}

.router-link-exact-active, .admin-left-panel a:focus, .admin-left-panel a:hover {
 color: #348fe2 !important;
}

.admin-content {
 width: calc(100% - 240px);
 box-sizing: border-box;
 padding: 15px 20px;
 overflow: auto;
 position: relative;
 -webkit-transition: left .2s linear;
 transition: left .2s linear;
}

.admin-content::v-deep(table) {
 box-sizing: border-box;
 border: solid #e0e0dc;
 border-width: 1px 0 0 1px;
}

.admin-content::v-deep(table thead) {
 text-transform: uppercase;
 font-weight: 500;
}

.admin-content::v-deep(table td), .admin-content::v-deep(table th) {
 border-width: 0 1px 1px 0;
 border: solid #e0e0dc;
 padding: 6px 5px;
}

.left-panel-top, .left-panel-bottom {
 display: flex;
 flex-direction: column;
}

.left-panel-top {
 margin-top: 10px
}

.left-panel-bottom {
 margin-bottom: 10px
}

</style>