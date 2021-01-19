<template>
 <div class="add-new-breakdown-wrapper">
  <div class="add-new-breakdown-block green-block">
   <div class="add-new-breakdown-name">Добавить новую поломку</div>
   <form class="add-new-breakdown-form" @submit="addNewBreakdown">
    <label>
     <select v-model="spaceshipName" :disabled="isLoading || isSuccess" required>
      <option disabled selected>
       Выберите корабль
      </option>
      <option v-for="sp in spaceships" :key="sp.id">{{ sp.name }}</option>
     </select>
    </label>
    <div class="add-new-breakdown-last-row">
     <label for="new-breakdown-time">
      Время проишествия
      <input id="new-breakdown-time" v-model="date" :disabled="isLoading || isSuccess" required type="datetime-local">
     </label>
     <input v-show="!isContinue" class="pretty-input clickable" type="submit" value="Продолжить">
    </div>
    <div class="add-new-breakdown-last-row">
     <label v-show="isContinue"> Описание поломки
      <textarea v-model="description" :disabled="isLoading || isSuccess" :required="isContinue"/>
     </label>
     <input v-show="isContinue" :disabled="isLoading" :value="isLoading ? 'Ожидайте...' : 'Загрузить'"
            class="pretty-input clickable"
            type="submit">
    </div>
   </form>
  </div>
  <div v-show="isComplete" class="result-text">
   <div :class="isSuccess ? '' : 'red'">{{ completedMessage }}</div>
   <div v-show="isSuccess">Хотите добавить
    <router-link :to="{name: 'Breakdown', params: {idStr: String(breakdownId), addSolutionStr: 'true'}}">решение?
    </router-link>
    <div class="clickable green" @click="resetFlags">Ещё одну поломку?</div>
    <router-link :to="{name: 'BreakdownsList'}">Смотреть все поломки</router-link>

   </div>
  </div>
 </div>
</template>

<script>
import router from "@/router";
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';

export default {
 name: "AddNewBreakdown",
 props: {
  spaceshipInited: Object,
  dateInited: String,
  withLimit: {
   default: false,
   type: Boolean
  },
  continueInput: {
   default: 'false',
   type: String
  },
 },
 data() {
  return {
   spaceshipName: null,
   date: null,
   isContinue: false,
   description: '',
   isLoading: false,
   isComplete: false,
   isSuccess: false,
   completedMessage: '',
   breakdownId: null
  }
 },
 computed: {
  ...mapState(['spaceships', 'URLs']),
  ...mapGetters(['spaceshipByIDorName'])

 },
 methods: {
  ...mapActions(['getSpaceships']),
  ...mapMutations(['setNewBreakdown']),
  resetFlags() {
   this.isSuccess = this.isComplete = this.isLoading = false
   this.description = ''
   this.date = null
   this.spaceshipName = null
  },
  addNewBreakdown(e) {
   e.preventDefault()
   if (this.$route.name !== 'AddNewBreakdown')
    router.push({
     name: 'AddNewBreakdown',
     params: {
      dateInited: this.date,
      spaceshipInited: this.spaceshipName,
      continueInput: 'true'
     }
    })
   else {
    this.isLoading = true
    this.axios.post(this.URLs.addBreakdowns,
      {
       date: new Date(this.date).getTime(),
       spaceshipId: this.spaceshipByIDorName(this.spaceshipName).id,
       description: this.description
      }
    ).then(ret => {
     this.isComplete = true
     console.log(ret.data.data)
     if (ret.data.data) {
      this.completedMessage = 'Успешно!'
      this.isSuccess = true
      ret.data.data.spaceship = this.spaceshipName
      ret.data.data.isSolved = false
      ret.data.data.description = this.description
      ret.data.data.date = new Date(this.date)
      ret.data.data.device = null
      ret.data.data.detector = null
      ret.data.data.solutionDescription = null
      this.setNewBreakdown({newBreakdown: ret.data.data})
      this.breakdownId = ret.data.data.id
     } else throw ret
    }).catch(e => {
     this.isSuccess = false
     this.isComplete = true
     this.completedMessage = 'Ошибка!'
     console.log(e)
    }).finally(() => {
     this.isLoading = false
    })
   }
  }
 },
 mounted() {
  if (!this.spaceships.length) this.getSpaceships()
  if (this.spaceshipInited)
   this.spaceshipName = this.spaceshipInited
  if (this.dateInited)
   this.date = this.dateInited
  if (this.continueInput)
   this.isContinue = this.continueInput === 'true'
  if (!this.withLimit)
   this.isContinue = true
 }
}
</script>

<style scoped>
.add-new-breakdown-wrapper {
 width: 60%;
 margin: auto;
 max-width: 1000px;
}

.add-new-breakdown-name {
 font-size: 1.5rem;
 font-weight: bold;
}

.add-new-breakdown-form {
 display: flex;
 flex-direction: column;
 align-items: flex-start;
}

.add-new-breakdown-form select, .add-new-breakdown-form input {
 padding: 5px;
 border-radius: 7px;
 border: 1px solid transparent;
 font-size: 1rem;
}

.add-new-breakdown-form > * {
 margin-bottom: 15px;
}

.add-new-breakdown-form > *:last-child {
 margin-bottom: 0;
}

.add-new-breakdown-name {
 margin-bottom: 10px;
}

label {
 display: flex;
 flex-direction: column;
 text-align: left;
}

.add-new-breakdown-form input[type=submit] {
 font-size: 1.1rem;
 padding: 7px 10px;
 font-weight: 500;
 border-width: 2px;
}

.add-new-breakdown-last-row {
 display: flex;
 justify-content: space-between;
 width: 100%;
 align-items: flex-end;
}

.result-text {
 font-weight: bolder;
 font-size: 1.1rem;
}

.green {
 color: #42b983;
}

.red {
 color: #BA4330;
}
</style>