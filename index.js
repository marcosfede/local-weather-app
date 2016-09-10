let vm = new Vue({
  el: '#app',
  data: {
    weather: '',
    units: 'C'
  },
  created: function () {
    this.getGeolocation()
  },
  watch: {
    units: 'getGeolocation'
  },
  methods: {
    'getGeolocation': function () {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          let api = `http://api.openweathermap.org/data/2.5/weather?`
          let lat = position.coords.latitude.toString()
          let long = position.coords.longitude.toString()
          let latlong = `lat=${lat}&lon=${long}`
          let units = vm.units === 'C' ? '&units=metric' : '&units=imperial'
          let appid = '&APPID=eac1a9c63fa08c4a84e04c2bacb20b15'
          vm.$http.get(api + latlong + units + appid)
            .then((response) => {
              let data = response.body
              vm.weather = {
                city: data.name,
                country: data.sys.country,
                temp_avg: data.main.temp,
                temp_min: data.main.temp_min,
                temp_max: data.main.temp_max,
                weather_main: data.weather[ 0 ].main,
                weather_description: data.weather[ 0 ].description
              }
            }, (response) => {
              console.log('error', response)
            })
        })
      } else {
        window.alert('geolocation not found')
      }
    },
    'changeUnits': function () {
      this.units = this.units == 'C' ? 'F' : 'C'
    }
  }
})
