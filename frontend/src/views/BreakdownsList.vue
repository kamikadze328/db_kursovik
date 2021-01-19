<template>
 <div :style="{margin: withLimit ? 0 : 'auto'}" class="breakdown-list-wrapper block">
  <div v-if="!withLimit" class="block-title">Список всех поломок (показано
   {{ breakdownsFiltered.length }}/{{ breakdowns.length }})
  </div>
  <div v-if="withSearch" class="search-block block">
   <div class="search-input-wrapper">
    <label for="search-input">
     <input id="search-input" v-model="filters.searchStr" autocomplete="off" class="search-input"
            placeholder="Поиск по всем поломкам" type="text" @keyup.enter="routeToBreakdownsList">
    </label>
    <div class="search-input-icon"></div>
   </div>
   <div class="open-all-filters">
    <div v-if="$route.name === 'BreakdownsList'" class="clickable" @click="isFilteredOpened=!isFilteredOpened">
     {{ isFilteredOpened ? 'Скрыть' : 'Показать все' }} фильтры
    </div>
    <router-link v-else :to="{name: 'BreakdownsList', query: {searchStr: filters.searchStr}}">Открыть все фильтры
    </router-link>
   </div>
  </div>
  <div v-if="isFilteredOpened && !withLimit" class="breakdown-list-filters">
   <div>
    <label> Корабль
     <select v-model="filters.spaceship">
      <option :value="null" selected></option>
      <option v-for="spaceship in spaceships" :key="spaceship.id" :value="spaceship.id">{{ spaceship.name }}</option>
     </select>
    </label>
   </div>
   <div>
    <label> Откуда
     <select v-model="filters.planetFrom">
      <option :value="null" selected></option>
      <option v-for="planet in planets" :key="planet.id" :value="planet.name">{{ planet.name }}</option>
     </select>
    </label>
    <label> Куда
     <select v-model="filters.planetTo">
      <option :value="null" selected></option>
      <option v-for="planet in planets" :key="planet.id" :value="planet.name">{{ planet.name }}</option>
     </select>
    </label>
   </div>
   <div>
    <label>Только решённые
     <input v-model="filters.onlySolved" :disabled="filters.onlyNotSolved" type="checkbox">
    </label>
    <label>нерешённые
     <input v-model="filters.onlyNotSolved" :disabled="filters.onlySolved" type="checkbox">
    </label>
   </div>
  </div>
  <table>
   <thead v-show="withSearch || breakdownsFiltered.length">
   <tr>
    <th v-if="!withLimit"></th>
    <th>Корабль</th>
    <th>Дата и время</th>
    <th>Откуда</th>
    <th>Куда</th>
    <th>Решено</th>
    <th v-if="!withLimit">Устройство</th>
    <th v-if="!withLimit">Тег</th>
   </tr>
   </thead>
   <tbody>
   <template v-for="br in breakdownsFiltered" :key="br.id">
    <tr :class="{'clickable': withLimit}" @click="routeToBreakdown(br.id)">
     <td v-if="!withLimit" class="clickable" @click="toggleVisibilityDescriptionRow">
      <div :class="openCloseRowClasses.closed" class="svg-img"></div>
     </td>
     <td>
      {{ br.spaceship }}
     </td>
     <td>{{ localDateStr(br.date) }}</td>
     <td>{{ br.planetFrom }}</td>
     <td>{{ br.planetTo }}</td>
     <td>{{ br.isSolved ? 'да' : 'нет' }}</td>
     <td>{{ br.device }}</td>
     <td>{{ br.detector }}</td>
    </tr>
    <tr class="open-description" style="display: none;">
     <td colspan="2">
      <router-link :to="{name: 'Breakdown', params: {idStr: String(br.id)}}">Открыть</router-link>
     </td>
     <td class="solution-title" colspan="6"> {{ br.description }}
      <br v-show="br.solutionDescription">
      {{ br.solutionDescription }}
     </td>
    </tr>
    <tr class="empty-row" style="display: none;"></tr>
   </template>
   <tr v-if="breakdownsFiltered.length === 0">
    <th :colspan="withLimit ? 6 : 8">Ничего не найдено((</th>
   </tr>
   <tr>
    <th v-if="withLimit && withSearch" :colspan="withLimit ? 6 : 8">
     <router-link :to="{name: 'BreakdownsList', query: {searchStr: filters.searchStr}}">Показать все</router-link>
    </th>
   </tr>

   </tbody>
  </table>
 </div>
</template>

<script>
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';

export default {
 name: "BreakdownsList",
 props: {
  withLimit: {
   default: false,
   type: Boolean
  },
  withSearch: {
   default: true,
   type: Boolean
  },
  excludeBreakdownId: {
   type: Number,
   required: false
  },
  planetFromInited: {
   type: String,
   required: false
  },
  planetToInited: {
   type: String,
   required: false
  },
  devicesInSpaceshipInited: {
   type: Number,
   required: false
  },
  devicesInited: {
   type: Number,
   required: false
  },
  spaceshipMadeInInited: {
   type: String,
   required: false
  },
  spaceshipInited: {
   type: String,
   required: false
  }
 },
 data() {
  return {
   filters: {
    onlySolved: false,
    onlyNotSolved: false,
    planetFrom: null,
    planetTo: null,
    spaceship: null,
    searchStr: '',
   },
   isFilteredOpened: true,
   openCloseRowClasses: {
    opened: 'minus-icon',
    closed: 'plus-icon'
   },
   countLimit: 5
  }
 },
 computed: {
  ...mapState(['breakdowns', 'spaceships', 'planets', 'breakdownsAllNumber']),
  ...mapGetters(['localDateStr', 'spaceshipByIDorName']),
  breakdownsFiltered() {
   let count = 0
   return this.breakdowns.filter(br => {
    if (this.excludeBreakdownId !== undefined && br.id === this.excludeBreakdownId) return false
    if (this.filters.onlySolved && !br.isSolved) return false
    if (this.filters.onlyNotSolved && br.isSolved) return false
    if (this.filters.planetFrom && br.planetFrom !== this.filters.planetFrom) return false
    if (this.filters.planetTo && br.planetTo !== this.filters.planetTo) return false
    if (this.filters.spaceship && br.spaceship !== this.filters.spaceship) return false
    if (this.spaceshipMadeInInited && this.spaceshipByIDorName(br.spaceship).madeAtPlanet !== this.spaceshipMadeInInited) return false
    if (this.devicesInSpaceshipInited && !this.spaceshipByIDorName(br.spaceship).devices.some(d => d.id === this.devicesInSpaceshipInited)) return false

    if (this.filters.searchStr
      && !br.description.toLowerCase().includes(this.filters.searchStr.toLowerCase())
      && !br.spaceship.toLowerCase().includes(this.filters.searchStr.toLowerCase())
      && !br.planetFrom.toLowerCase().includes(this.filters.searchStr.toLowerCase())
      && !br.planetTo.toLowerCase().includes(this.filters.searchStr.toLowerCase())
    ) return false
    count++
    if(this.withLimit && count > this.countLimit) return false
    return true
   })
  },

 },
 watch: {
  filters: {
   handler(val) {
    if (this.$route.name === 'BreakdownsList')
     this.$router.push({
      name: 'BreakdownsList',
      query: {
       searchStr: val.searchStr,
       onlySolved: val.onlySolved,
       onlyNotSolved: val.onlyNotSolved,
       planetFrom: val.planetFrom,
       planetTo: val.planetTo,
       spaceship: val.planetTo,
      }
     })
   },
   deep: true
  },
  breakdownsFiltered: {
   handler(val) {
    val.forEach(breakdown => this.addSameBreakdown({breakdown}))
   },
   deep: true
  }
 },
 methods: {
  ...mapActions(['getBreakdowns', 'getPlanets']),
  ...mapMutations(['addSameBreakdown']),
  toggleVisibilityDescriptionRow(e) {
   let htmlElem = e.target
   while (!htmlElem.classList.contains('svg-img')) {
    htmlElem = htmlElem.firstElementChild
   }
   htmlElem.classList.toggle(this.openCloseRowClasses.closed)
   htmlElem.classList.toggle(this.openCloseRowClasses.opened)
   while (htmlElem.tagName !== 'TR') {
    htmlElem = htmlElem.parentElement
   }
   htmlElem = htmlElem.nextElementSibling
   htmlElem.style.display = htmlElem.style.display === 'none' ? 'table-row' : 'none'
   htmlElem = htmlElem.nextElementSibling
   htmlElem.style.display = htmlElem.style.display === 'none' ? 'table-row' : 'none'
  },
  routeToBreakdownsList() {
   if (this.withLimit)
    this.$router.push({name: 'BreakdownsList', query: {searchStr: this.filters.searchStr}})
  },
  routeToBreakdown(id) {
   if (this.withLimit)
    this.$router.push({name: 'Breakdown', params: {idStr: String(id)}})

  }
 },
 mounted() {
  if (!this.breakdowns.length) this.getBreakdowns()
  if(!this.withLimit && !this.planets.length) this.getPlanets()
  if (this.$route.query.searchStr)
   this.filters.searchStr = this.$route.query.searchStr
  if (this.$route.query.onlySolved)
   this.filters.onlySolved = this.$route.query.onlySolved === 'true'
  if (this.$route.query.onlyNotSolved)
   this.filters.onlySolved = this.$route.query.onlyNotSolved === 'true'
  if (this.$route.query.spaceship !== undefined)
   this.filters.spaceship = this.$route.query.spaceship
  if (this.$route.query.planetTo !== undefined)
   this.filters.planetTo = this.$route.query.planetTo
  if (this.$route.query.planetFrom !== undefined)
   this.filters.planetFrom = this.$route.query.planetFrom
  if (this.planetToInited !== undefined)
   this.filters.planetTo = this.planetToInited
  if (this.planetFromInited !== undefined)
   this.filters.planetFrom = this.planetFromInited
  if (this.spaceshipInited !== undefined)
   this.filters.spaceship = this.spaceshipInited
 }
}
</script>

<style scoped>

table {
 width: 100%;
}

table tbody tr:last-child {
 text-align: center;
}

.breakdown-list-filters {
 margin-right: 10px;
 margin-left: 10px;
 display: flex;
 justify-content: space-between;
 margin-bottom: 10px;
 max-width: 750px;
}

.breakdown-list-filters > * {
 font-size: 1.1rem;
}

.search-input {
 padding: 5px 55px 5px 20px;
 border-radius: 15px;
 height: 40px;
 line-height: 40px;
 font-size: 1.5rem;
 border: 2px solid #a9a9a9;
 width: calc(100% - 45px);
}

.search-input-icon {
 position: relative;
 top: 15px;
 left: -10px;
 background-repeat: no-repeat;
 width: 30px;
 height: 30px;
 background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 511.999 511.999' style='enable-background:new 0 0 511.999 511.999;' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Cpath d='M508.874,478.708L360.142,329.976c28.21-34.827,45.191-79.103,45.191-127.309c0-111.75-90.917-202.667-202.667-202.667 S0,90.917,0,202.667s90.917,202.667,202.667,202.667c48.206,0,92.482-16.982,127.309-45.191l148.732,148.732 c4.167,4.165,10.919,4.165,15.086,0l15.081-15.082C513.04,489.627,513.04,482.873,508.874,478.708z M202.667,362.667 c-88.229,0-160-71.771-160-160s71.771-160,160-160s160,71.771,160,160S290.896,362.667,202.667,362.667z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");
}

.search-input-wrapper {
 display: flex;
 margin: auto;
}

label[for=search-input] {
 width: 100%;
}

.open-all-filters {
 text-align: right;
 margin: 2px auto 10px auto;
 font-size: .8rem;
}

.svg-img {
 background-repeat: no-repeat;
 width: 20px;
 height: 20px;
}

.plus-icon {
 background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 512 512' fill='%2300000'%3E%3Cg%3E%3Cpath d='M492,236H276V20c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v216H20c-11.046,0-20,8.954-20,20s8.954,20,20,20h216 v216c0,11.046,8.954,20,20,20s20-8.954,20-20V276h216c11.046,0,20-8.954,20-20C512,244.954,503.046,236,492,236z'/%3E%3C/g%3E%3C/svg%3E");
}

.minus-icon {
 background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 512 512' fill='%23000000'%3E%3Cg%3E%3Cg%3E%3Cpath d='M492,236H20c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20h472c11.046,0,20-8.954,20-20S503.046,236,492,236z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.open-description {
 text-align: left;
 padding-bottom: 10px;
}

.empty-row {
 height: 10px;
}

.highlight {
 background-color: yellow;
}

tr.clickable:focus, tr.clickable:hover {
 background-color: rgba(66, 185, 131, .2);
}
</style>