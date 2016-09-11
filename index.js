let vm = new Vue({
  el: '#app',
  data: {
    weather: '',
    units: 'C',
    fetched: false
  },
  created: function () {
    this.getGeolocation()
  },
  watch: {
    units: 'getGeolocation'
  },
  computed: {
    weatherIcon : function () {
      // icon sun-shower is not being used, rain+sun mix
      switch (this.weather.weather_main) {
        case 'clear-day':
          return 'sunny'
        case 'clear-night':
          return 'sunny'
        case 'rain':
          return 'rainy'
        case 'snow':
          return 'flurries'
        case 'sleet':
          return 'flurries'
        case 'wind':
          return 'cloudy'
        case 'fog':
          return 'cloudy'
        case 'cloudy':
          return 'cloudy'
        case 'partly-cloudy-day':
          return 'cloudy'
        case 'partly-cloudy-night':
          return 'cloudy'
        case 'thunderstorm':
          return 'thunder-storm'
        default:
          return 'cloudy'
      }
    }
  },
  methods: {
    getGeolocation: function () {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          let lat = position.coords.latitude.toString()
          let long = position.coords.longitude.toString()
          let units = this.units === 'C' ? '?units=si' : '?units=us'
          let key = 'd341ccf7b450b32649103b0cb6615f96'
          let api = `https://api.forecast.io/forecast/${key}/${lat},${long}`
          $.getJSON(api + units + "&callback=?")
            .then((response) => {
              let data = response
              this.weather = {
                city: data.timezone.split('/')[2].replace(/\_/, ' '),
                country: data.timezone.split('/')[1],
                temp_avg: data.currently.temperature,
                temp_min: data.daily.data[0].temperatureMin,
                temp_max: data.daily.data[0].temperatureMax,
                weather_main: data.currently.summary,
              }
              this.fetched = true
            }, (response) => {
              console.log('error', response)
            })
        })
      } else {
        window.alert('geolocation not found')
      }
    },
    changeUnits: function () {
      this.units = this.units == 'C' ? 'F' : 'C'
    }
  },
  filters: {
    round: value => {
      return value ? Math.round(value) : ''
    }
  }
})
