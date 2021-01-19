<template>
 <div class="block">
  <div class="block-title"> Поломка №{{ breakdown.id }}</div>
  <div class="green-block breakdown-block">
   <div class="breakdown-spaceship-flight">
    <div>
     <div class="breakdown-key-value">
      <div>Корабль:&nbsp;</div>
      <div class="breakdown-value">{{ breakdown.spaceship }}</div>
     </div>
     <div class="breakdown-key-value">
      <div>Произведён на:&nbsp;</div>
      <div class="breakdown-value">{{ spaceship.madeAtPlanet }}</div>
     </div>
     <div class="breakdown-key-value">
      <div>Домашняя планета:&nbsp;</div>
      <div class="breakdown-value">{{ spaceship.homePlanet }}</div>
     </div>
     <div class="breakdown-key-value">
      <div> Сейчас на:&nbsp;</div>
      <div class="breakdown-value">{{ spaceship.currentPlanet }}</div>
     </div>
    </div>
    <div class="breakdown-last-flight">
     <div class="planet-from-to"> {{ breakdown.planetFrom + ' --> ' + breakdown.planetTo }}</div>
     <div class="date-from-to"> {{ localDateStr(breakdown.dateFrom) + ' --> ' + localDateStr(breakdown.dateTo) }}</div>
    </div>
   </div>

   <div class="br"></div>
   <div class="breakdown-key-value">
    <div> Устройства:&nbsp;</div>
    <div v-if="showDevices" class="clickable" @click="showDevices=false">Скрыть</div>
    <div v-else class="clickable" @click="showDevices=true">Показать</div>
   </div>
   <div v-if="showDevices" class="breakdown-value">
    {{ spaceship.devicesId.map(id => devicesDetectorsById(id).name).join(', ') }}
   </div>

   <div class="br"></div>
   <div class="breakdown-key-value">
    <div> Когда:&nbsp;</div>
    <div class="breakdown-value">{{ localDateStr(breakdown.date) }}</div>
   </div>

   <div class="br"></div>
   <div> {{ breakdown.description }}</div>
  </div>

  <div class="block-title solution-title">
   <div v-if="addSolution || breakdown.isSolved">Решение</div>
   <div v-else> Нет решения. Хотите &nbsp;<div class="clickable" @click="createSolution">добавить?</div>
   </div>
  </div>
  <div v-show="addSolution || breakdown.isSolved" class="green-block breakdown-block">
   <label v-if="addSolution" class="breakdown-key-value">
    Выберите проблемное устройство: &nbsp;
    <select v-model="solution.device" :disabled="isLoading">
     <option selected></option>
     <option v-for="dev in spaceship.devicesId.map(id => devicesDetectorsById(id))" :key="dev.id" :value="dev">
      {{ dev.name }}
     </option>
    </select>
   </label>
   <div v-else-if="breakdown.device"> Проблемное устройство: {{ breakdown.device }}</div>
   <label v-if="addSolution" class="breakdown-key-value">
    Выберите проблемный детектор: &nbsp;
    <select v-model="solution.detector" :disabled="isLoading || !solution.device">
     <option selected></option>
     <option v-for="detector in (solution.device ? solution.device.detectors : [])" :key="detector.id"
             :value="detector">{{ detector.description }}
     </option>
    </select>
   </label>
   <div v-else-if="breakdown.detector"> Проблемный детектор: {{ breakdown.detector }}</div>
   <div v-if="addSolution" class="breakdown-last-row">
    <label class="breakdown-key-value"> Описание решения: &nbsp;
     <textarea v-model="solution.description" :disabled="isLoading" required/>
    </label>
    <input :value="isLoading ? 'Ожидайте...' : 'Загрузить'"
           class="pretty-input clickable" type="submit" @click="uploadSolution">
   </div>
   <div class="br"></div>
   <div>{{ breakdown.solutionDescription }}</div>
  </div>
  <div class="same-breakdowns-titles">
   <div class="block-title">Похожие поломки ({{ sameUniqueBreakdownsNumber }} различных /
    {{ sameUniqueBreakdownsNumberSolved }} решённых)
   </div>
   <div class="back-to-list">
    <router-link :to="{name: 'BreakdownsList'}">Назак ко всему списку</router-link>
   </div>
  </div>
  <div class="same-breakdowns">
   <div v-if="solution.device">
    <div class="same-breakdowns-title">Корабли с&nbsp;<div>
     {{ solution.device ? solution.device.name : undefined }}
    </div>
    </div>
    <BreakdownsList :devices-inited="solution.device ? solution.device.id : undefined"
                    :exclude-breakdown-id="breakdown.id" :with-limit="true"
                    :with-search="false"/>
   </div>
   <div v-if="solution.device">
    <div class="same-breakdowns-title">Поломки из-за&nbsp;<div>
     {{ solution.device ? solution.device.name : undefined }}
    </div>
    </div>
    <BreakdownsList :exclude-breakdown-id="breakdown.id" :spaceship="solution.device ? solution.device.id : undefined"
                    :with-limit="true"
                    :with-search="false"/>
   </div>
   <div>
    <div class="same-breakdowns-title">Полёт с&nbsp;<div>{{ breakdown.planetFrom }}</div>
    </div>
    <BreakdownsList :exclude-breakdown-id="breakdown.id" :planet-from-inited="breakdown.planetFrom" :with-limit="true"
                    :with-search="false"/>
   </div>
   <div>
    <div class="same-breakdowns-title">Произведён на&nbsp;<div>{{ spaceship.madeAtPlanet }}</div>
    </div>
    <BreakdownsList :exclude-breakdown-id="breakdown.id" :spaceship-made-in-inited="spaceship.madeAtPlanet"
                    :with-limit="true"
                    :with-search="false"/>
   </div>
   <div>
    <div class="same-breakdowns-title">Полёт на&nbsp;<div>{{ breakdown.planetTo }}</div>
    </div>
    <BreakdownsList :exclude-breakdown-id="breakdown.id" :planet-to-inited="breakdown.planetTo" :with-limit="true"
                    :with-search="false"/>
   </div>
   <div>
    <div class="same-breakdowns-title">Этот же корабль&nbsp;(
     <div>{{ spaceship.name }})</div>
    </div>
    <BreakdownsList :exclude-breakdown-id="breakdown.id" :spaceship-inited="spaceship.name" :with-limit="true"
                    :with-search="false"/>
   </div>
  </div>
 </div>
</template>

<script>
import {mapGetters, mapMutations, mapState, mapActions} from 'vuex';
import BreakdownsList from "@/views/BreakdownsList";

export default {
 name: "Breakdown",
 components: {BreakdownsList},
 props: {
  idStr: {
   type: String,
   required: true
  },
  addSolutionStr: {
   default: 'false',
   type: String,
   required: false
  }
 },
 watch: {
  idStr() {
   this.resetComponent()
   this.resetSameUniqueBreakdowns()
  }
 },
 data() {
  return {
   showDevices: false,
   solution: {
    device: null,
    detector: null,
    description: ''
   },
   addSolution: false,
   isLoading: false
  }
 },
 computed: {
  ...mapState(['URLs', 'devicesDetectors']),
  ...mapGetters(['breakdownById', 'localDateStr', 'spaceshipByIDorName', 'sameUniqueBreakdownsNumber', 'sameUniqueBreakdownsNumberSolved', 'devicesDetectorsById']),
  breakdown() {
   return this.breakdownById(Number(this.idStr))
  },
  spaceship() {
   return this.spaceshipByIDorName(this.breakdown.spaceship)
  },
 },
 methods: {
  ...mapActions(['getDevicesDetectors']),
  ...mapMutations(['resetSameUniqueBreakdowns', 'updateBreakdown']),
  createSolution() {
   this.resetComponent()
   this.addSolution = true
  },
  resetComponent() {
   this.solution.detector = this.solution.device = null
   this.solution.description = ''
   this.showDevices = this.addSolution = this.isLoading = false
  },
  uploadSolution() {
   this.isLoading = true
   this.axios.post(this.URLs.addSolution,
     {
      breakdownId: this.breakdown.id,
      description: this.solution.description,
      deviceId: this.solution.device.id,
      detectorId: this.solution.detector.id
     }
   ).then(ret => {
    this.isComplete = true
    console.log(ret.data.data)
    if (ret.data.data) {
     this.completedMessage = 'Успешно!'
     this.isSuccess = true
     this.updateBreakdown({
      breakdownId: this.breakdown.id,
      solutionDescription: this.solution.description,
      device: this.solution.device.name,
      detector: this.solution.detector.description
     })
     this.resetComponent()
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
 },
 mounted() {
  if (this.addSolutionStr === 'true') this.addSolution = true
  //if (this.breakdown.device) this.solution.device = this.devicesDetectors.find(dev => dev.name === this.breakdown.device)
  //f (this.breakdown.detector) this.solution.detector = this.solution.device.detectors.find(d => d.description === this.solution.detector)
  if (!this.devicesDetectors.length) this.getDevicesDetectors()
 },
}
</script>

<style scoped>
.solution-title * {
 display: flex;
}

.breakdown-block {
 font-size: 1.4rem;
 text-align: left;
}

.breakdown-spaceship-flight {
 display: inline-flex;
 justify-content: space-between;
 width: 100%;
}

.breakdown-last-flight {
 min-width: 430px;
}

.same-breakdowns {
 display: grid;
 grid-template-columns: auto auto;
 grid-column-gap: 50px;
 grid-row-gap: 20px;
}

.date-from-to {
 text-align: right;
}

.planet-from-to {
 text-align: center;
}

.breakdown-value {
 font-weight: 600;
}

.breakdown-key-value {
 display: inline-flex;
 width: 100%;
}

.br {
 height: 10px;
}

select {
 font-size: 1.2rem;
}

label.breakdown-key-value {
 margin-bottom: 5px;
}

.breakdown-last-row {
 display: flex;
 justify-content: space-between;
 width: 100%;
 align-items: flex-end;
}

.pretty-input[type=submit] {
 padding: 7px 10px;
 font-size: 1.2rem;
}

.same-breakdowns-title {
 display: flex;
 justify-content: center;
 font-size: 1.2rem;
}

.same-breakdowns-title > * {
 font-weight: bold;
}

.solution-title .clickable {
 font-weight: bold;
 color: #42b983;
}

.back-to-list {
 text-align: right;
}

.same-breakdowns-titles {
 display: flex;
 justify-content: space-between;
 align-items: flex-end;
}
</style>