import {createStore} from 'vuex'

//let SERVER_BASE_URL = '/~s264434/db_kursovik/php'
let SERVER_BASE_URL = '/php'
import axios from "axios";

export default createStore({
  state: {
    URLs: {
      addBreakdowns: SERVER_BASE_URL + '/breakdowns/add_breakdowns.php',
      addSolution: SERVER_BASE_URL + '/breakdowns/add_solution.php',

      getData: SERVER_BASE_URL + '/get_data.php',
    },
    SERVER_ACTIONS: {
      getBreakdowns: 'breakdowns',
      getSpaceships: 'spaceships',
      getDevicesDetectors: 'devices_detectors',
      getPlanets: 'planets',
    },
    planets: [
      /*
            {"id":12,"name":"Земля"},{"id":13,"name":"Меркурий"},{"id":14,"name":"Венера"},{"id":15,"name":"Марс"},{"id":16,"name":"Юпитер"},{"id":17,"name":"Сатурн"},{"id":18,"name":"Уран"},{"id":19,"name":"Нептун"},{"id":20,"name":"Луна"}
      */
    ],
    spaceships: [
      /*
                  {"id":11,"name":"Гaй-дo","devices_id":[21,22,24,25,26],"madeAtPlanet":"Земля","currentPlanet":"Нептун","homePlanet":"Земля"},{"id":12,"name":"Пегас","devices_id":[21,22,23,25],"madeAtPlanet":"Земля","currentPlanet":"Нептун","homePlanet":"Земля"},{"id":13,"name":"Вояджер","devices_id":[21,22,23,25],"madeAtPlanet":"Земля","currentPlanet":"Нептун","homePlanet":"Земля"},{"id":14,"name":"Союз","devices_id":[21,22,23,25],"madeAtPlanet":"Земля","currentPlanet":"Нептун","homePlanet":"Земля"},{"id":15,"name":"Восход","devices_id":[21,22,24,26],"madeAtPlanet":"Марс","currentPlanet":"Меркурий","homePlanet":"Марс"},{"id":17,"name":"Восток","devices_id":[21,22,24],"madeAtPlanet":"Марс","currentPlanet":"Нептун","homePlanet":"Марс"},{"id":16,"name":"Шаттл","devices_id":[21,22,24,26],"madeAtPlanet":"Марс","currentPlanet":"Уран","homePlanet":"Марс"}
      */
    ],
    breakdowns: [
      /*
                  {"id":17,"date":"2018-06-18T23:32:00.000Z","spaceship":"Гaй-дo","description":"Всё сломалось опять чинить надо(","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":10,"date":"2018-06-18T23:32:00.000Z","spaceship":"Гaй-дo","description":"Всё сломалось опять чинить надо(","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":15,"date":"2018-06-18T23:32:00.000Z","spaceship":"Гaй-дo","description":"Всё сломалось опять чинить надо(","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":21,"date":"2018-06-13T23:50:00.000Z","spaceship":"Вояджер","description":"awdawdwada","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-03T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":24,"date":"2019-08-01T15:52:00.000Z","spaceship":"Пегас","description":"awdawdawddasdcgvdrhbr","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-02T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":8,"date":"2018-06-18T23:32:00.000Z","spaceship":"Союз","description":"лялял","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-05T00:00:00.000Z","dateTo":"2020-05-12T00:00:00.000Z"},{"id":6,"date":"2019-07-01T00:00:00.000Z","spaceship":"Шаттл","description":"не хочететь садиться","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Луна","planetTo":"Уран","dateFrom":"2020-04-08T00:00:00.000Z","dateTo":"2020-05-28T00:00:00.000Z"},{"id":23,"date":"2018-06-08T23:53:00.000Z","spaceship":"Вояджер","description":"awdawda","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-03T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":7,"date":"2019-09-01T00:00:00.000Z","spaceship":"Восток","description":"летит криво","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-08T00:00:00.000Z","dateTo":"2020-05-12T00:00:00.000Z"},{"id":20,"date":"2016-06-18T23:49:00.000Z","spaceship":"Шаттл","description":"вфцвлтфцдвтш","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Луна","planetTo":"Уран","dateFrom":"2020-04-08T00:00:00.000Z","dateTo":"2020-05-28T00:00:00.000Z"},{"id":11,"date":"2018-06-18T23:32:00.000Z","spaceship":"Гaй-дo","description":"Всё сломалось опять чинить надо(","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":12,"date":"2018-06-18T23:32:00.000Z","spaceship":"Гaй-дo","description":"Всё сломалось опять чинить надо(","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":18,"date":"2018-06-18T23:32:00.000Z","spaceship":"Гaй-дo","description":"Всё сломалось опять чинить надо(","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":2,"date":"2019-07-01T00:00:00.000Z","spaceship":"Пегас","description":"упал","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-02T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":13,"date":"2018-06-18T23:32:00.000Z","spaceship":"Гaй-дo","description":"Всё сломалось опять чинить надо(","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":5,"date":"2019-07-01T00:00:00.000Z","spaceship":"Восход","description":"взровался","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Луна","planetTo":"Меркурий","dateFrom":"2020-05-06T00:00:00.000Z","dateTo":"2020-05-12T00:00:00.000Z"},{"id":19,"date":"2019-02-18T23:48:00.000Z","spaceship":"Союз","description":"Kjkjkjkdawdkj","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-05T00:00:00.000Z","dateTo":"2020-05-12T00:00:00.000Z"},{"id":16,"date":"2018-06-18T23:32:00.000Z","spaceship":"Гaй-дo","description":"Всё сломалось опять чинить надо(","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":4,"date":"2019-11-01T00:00:00.000Z","spaceship":"Союз","description":"отвалилось крыло","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-05T00:00:00.000Z","dateTo":"2020-05-12T00:00:00.000Z"},{"id":1,"date":"2019-07-01T00:00:00.000Z","spaceship":"Гaй-дo","description":"сломался","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":22,"date":"2019-01-26T02:55:00.000Z","spaceship":"Вояджер","description":"wadawrfvazs","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-03T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":3,"date":"2019-07-11T00:00:00.000Z","spaceship":"Вояджер","description":"не взлетает","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-03T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":14,"date":"2018-06-18T23:32:00.000Z","spaceship":"Гaй-дo","description":"Всё сломалось опять чинить надо(","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"},{"id":9,"date":"2018-06-18T23:32:00.000Z","spaceship":"Гaй-дo","description":"Всё сломалось опять чинить надо(","detector":null,"device":null,"isSolved":false,"solutionDescription":null,"planetFrom":"Юпитер","planetTo":"Нептун","dateFrom":"2020-05-01T00:00:00.000Z","dateTo":"2020-05-11T00:00:00.000Z"}
      */
    ],
    devicesDetectors: [],
    sameUniqueBreakdowns: []
  },
  getters: {
    sameUniqueBreakdownsNumber: state => {
      return state.sameUniqueBreakdowns.length
    },
    sameUniqueBreakdownsNumberSolved: state => {
      let count = 0
      state.sameUniqueBreakdowns.forEach(br => count += br.isSolved)
      return count
    },
    localDateStr: () => date => {
      const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        timezone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
      return new Date(date).toLocaleString("ru", options)
    },
    planet: state => id => {
      return state.planets.find(pl => pl.id === id)
    },
    spaceshipByIDorName: state => idOrName => {
      const isID = idOrName instanceof Number
      return state.spaceships.find(sp => sp[isID ? 'id' : 'name'] === idOrName)
    },
    breakdownById: state => id => {
      return state.breakdowns.find(br => br.id === id)
    },
    devicesDetectorsById: state => id => {
      return state.devicesDetectors.find(dev => dev.id === id)
    }
  },
  mutations: {
    setBreakdowns(state, {newBreakdowns}) {
      newBreakdowns.forEach(br => {
        br.date = new Date(br.date)
        br.dateFrom = new Date(br.dateFrom)
        br.dateTo = new Date(br.dateTo)
      })
      state.breakdowns = newBreakdowns
      console.log(newBreakdowns)
    },
    setNewBreakdown(state, {newBreakdown}) {
      newBreakdown.date = new Date(newBreakdown.date)
      newBreakdown.dateFrom = new Date(newBreakdown.dateFrom)
      newBreakdown.dateTo = new Date(newBreakdown.dateTo)
      state.breakdowns.push(newBreakdown)
    },
    updateBreakdown(state, {breakdownId, solutionDescription, device, detector}) {
      const breakdown = state.breakdowns.find(br => br.id === breakdownId)
      breakdown.solutionDescription = solutionDescription
      breakdown.device = device
      breakdown.detector = detector
      breakdown.isSolved = true
    },
    setSpaceships(state, {newSpaceships}) {
      console.log(newSpaceships)
      state.spaceships = newSpaceships
    },
    setPlanets(state, {newPlanets}) {
      state.planets = newPlanets
      console.log(newPlanets)
    },
    setDevicesDetectors(state, {newDevicesDetectors}) {
      state.devicesDetectors = newDevicesDetectors
      console.log(newDevicesDetectors)
    },
    resetSameUniqueBreakdowns(state) {
      state.sameUniqueBreakdowns = []
    },
    addSameBreakdown(state, {breakdown}) {
      if (state.sameUniqueBreakdowns.find(br => br.id === breakdown.id) === undefined)
        state.sameUniqueBreakdowns.push({id: breakdown.id, isSolved: breakdown.isSolved})
    }
  },
  actions: {
    getSpaceships({commit, state}) {
      const data = {purpose: state.SERVER_ACTIONS.getSpaceships}
      axios.post(state.URLs.getData, data)
        .then(ret => {
          console.log(ret)
          if (ret.data && ret.data.data)
            commit('setSpaceships', {newSpaceships: ret.data.data})
          else throw ret
        })
        .catch(e => {
          console.log(e)
        })
    },
    getDevicesDetectors({commit, state}) {
      const data = {purpose: state.SERVER_ACTIONS.getDevicesDetectors}
      axios.post(state.URLs.getData, data)
        .then(ret => {
          console.log(ret)
          if (ret.data && ret.data.data)
            commit('setDevicesDetectors', {newDevicesDetectors: ret.data.data})
          else throw ret
        })
        .catch(e => {
          console.log(e)
        })
    },
    getPlanets({commit, state}) {
      const data = {purpose: state.SERVER_ACTIONS.getPlanets}
      axios.post(state.URLs.getData, data)
        .then(ret => {
          console.log(ret)
          if (ret.data && ret.data.data)
            commit('setPlanets', {newPlanets: ret.data.data})
          else throw ret
        })
        .catch(e => {
          console.log(e)
        })
    },
    getBreakdowns({commit, state}) {
      const data = {purpose: state.SERVER_ACTIONS.getBreakdowns}
      axios.post(state.URLs.getData, data)
        .then(ret => {
          console.log(ret)
          if (ret.data && ret.data.data)
            commit('setBreakdowns', {newBreakdowns: ret.data.data})
          else throw ret
        })
        .catch(e => {
          console.log(e)
        })
    },
  },
  modules: {}
})
