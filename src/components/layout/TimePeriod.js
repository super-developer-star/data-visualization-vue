import { mixin as clickaway } from 'vue-clickaway'
import Loader from '../layout/Loader'
import Popper from 'vue-popperjs'

export default {
  name: 'time-period',
  mixins: [ clickaway ],
  props: {
    timePeriodType: {
      type: String,
      default: 'year'
    },
    timePeriodChanged: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loader,
    'popper': Popper
  },
  template: require('components/layout/TimePeriod.html'),
  data() {
    return {
      model: nch.model,
      service: nch.services,
      timePeriodService: nch.services.timePeriodService,
      scrollValue: 0,
      showTimePeriodOptions: this.timePeriodChanged,
      selectedItem: {
        year: [],
        quarter: [],
        month: [],
        week: [],
        ytd: []
      },
      yearOptions: [],
      quarterOptions: [],
      monthOptions: [],
      weekOptions: [],
      monthsName: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      arrayLength: 0,
      selectedYear: 2017,
      isLoading: false,
      showCueMessage: false
    }
  },
  computed: {
    displayTimeSelector() {
      return this.timePeriodChanged || this.showTimePeriodOptions
    },
    maxYear() {
      if (this.timePeriodType === 'month') {
        return this.monthOptions.reduce((a, b) => a.key < b.key ? b : a).key
      }

      return this.weekOptions.reduce((a, b) => a.key < b.key ? b : a).key
    },
    minYear() {
      if (this.timePeriodType === 'month') {
        return this.monthOptions.reduce((a, b) => a.key > b.key ? b : a).key
      }

      return this.weekOptions.reduce((a, b) => a.key > b.key ? b : a).key
    },
    hasNextYear() {
      return this.selectedYear < this.maxYear
    },
    hasPrevYear() {
      return this.selectedYear > this.minYear
    }
  },
  watch: {
    showTimePeriodOptions: function(val) {
      if (val) {
        this.setPeriod()
      }
    },
    timePeriodChanged: function(val) {
      if (val) {
        this.setPeriod()
      }
    },
    timePeriodType: function(val) {
      if (!val)
        return

      var selectedTimePeriod = nch.model.selectedItem[this.timePeriodType]
      this.arrayLength = selectedTimePeriod && selectedTimePeriod.counter ? selectedTimePeriod.counter : 0
      this.setInitPeriod(val)
    },
    selectedYear: function(val) {
      if (!val)
        return

      this.filterWeeks(val)
    }
  },
  mounted() {
    let component = this
    this.updateTimePeriodData()
    nch.eventDispatcher.$on('timePeriodDataLoaded', function() {
      component.updateTimePeriodData()

      var cachedTimePeriod = component.service.cacheService.getCacheTimeperiod()
      if(cachedTimePeriod) {
        component.model.selectedItem = cachedTimePeriod.selectedItem
        component.model.period1 = cachedTimePeriod.period1
        component.model.period2 = cachedTimePeriod.period2
        component.model.selectedTimePeriod = cachedTimePeriod.selectedTimePeriod
      } else {
        component.setInitYearData()
        component.setInitQuarterData()
        component.setInitMonthData()
        component.setInitWeekData()
        component.setInitPeriod(component.timePeriodType)
      }
    })
  },
  methods: {
    onAwayClick: function() {
      this.onClose();
    },

    setInitPeriod: function(type) {
      if(type === 'ytd') {
        return
      }

      if(type && this.model.selectedItem[type].data && this.model.selectedItem[type].data.length) {
        if(type === 'year') {
          this.model.selectedItem[type].data.sort(function(a, b) { return b.year - a.year })
        } else {
          this.model.selectedItem[type].data.sort(function(a, b) { return b.code - a.code })
        }
        this.model.period1 = this.model.selectedItem[type].data[1]
        this.model.period2 = this.model.selectedItem[type].data[0]
        //this.service.cacheService.setCacheTimeperiod()
      }
    },

    setPeriod: function () {
      this.selectedItem.year = nch.model.selectedItem.year.data.map(function(item) { return item })
      this.selectedItem.quarter = nch.model.selectedItem.quarter.data.map(function(item) { return item })
      this.selectedItem.month = nch.model.selectedItem.month.data.map(function(item) { return item })
      this.selectedItem.week = nch.model.selectedItem.week.data.map(function(item) { return item })
      var selectedTimePeriod = nch.model.selectedItem[this.timePeriodType]
      this.arrayLength = selectedTimePeriod && selectedTimePeriod.counter ? selectedTimePeriod.counter : 0
    },

    isValid: function(type, item) {
      if(type === 'year' || type === 'ytd')
        return (this.selectedItem[type][0] && item.year === this.selectedItem[type][0].year ) || (this.selectedItem[type][1] && item.year === this.selectedItem[type][1].year)
      else
        return (this.selectedItem[type][0] && item.code === this.selectedItem[type][0].code ) || (this.selectedItem[type][1] && item.code === this.selectedItem[type][1].code)
    },

    updateTimePeriodData: function() {
      this.yearOptions = this.timePeriodService.getYears()
      this.quarterOptions = this.timePeriodService.getQuarters()
      this.monthOptions = this.timePeriodService.getMonths()
      this.weekOptions = this.timePeriodService.getWeeks()
    },

    setInitYearData: function() {
      this.yearOptions.length > 2
        ? (this.model.selectedItem.year.data = this.yearOptions.slice(0, 2))
        : (this.model.selectedItem.year.data = this.yearOptions)
      this.model.selectedItem.year.counter = this.yearOptions.length
    },

    setInitQuarterData: function() {
      let temp = []
      this.quarterOptions.map(function(v) {
        v.values.map(function(obj) {
          temp.push(obj)
        })
      })

      temp.length > 2
        ? (this.model.selectedItem.quarter.data = temp.slice(0, 2))
        : (this.model.selectedItem.quarter.data = temp)
      this.model.selectedItem.quarter.counter = this.quarterOptions.length
    },

    setInitMonthData: function() {
      let temp = []
      let that = this
      that.model.selectedItem.month.counter = 0
      this.monthOptions.map(function(v) {
        v.values.map(function(k, i) {
          that.model.selectedItem.month.counter ++
          k.values.map(function(obj) {
            temp.push(obj)
          })
        })
      })

      temp.length > 2
        ? (this.model.selectedItem.month.data = temp.slice(0, 2))
        : (this.model.selectedItem.month.data = temp)
    },

    setInitWeekData: function() {
      let temp = []
      let that = this
      that.model.selectedItem.week.counter = 0
      this.weekOptions.map(function(v) {
        v.values.map(function(k, i) {
          that.model.selectedItem.week.counter ++
          k.values.map(function(obj) {
            temp.push(obj)
          })
        })
      })
      temp.length > 2
        ? (this.model.selectedItem.week.data = temp.slice(0, 2))
        : (this.model.selectedItem.week.data = temp)
    },

    itemClick: function(type, item) {
      this.showCueMessage = false

      if(this.isValid(type, item)) {
        if(type === 'year') {
          if(this.selectedItem[type][0].year === item.year)
            this.selectedItem[type].splice(0, 1)
          else this.selectedItem[type].splice(1, 1)
        } else {
          if(this.selectedItem[type][0].code === item.code)
            this.selectedItem[type].splice(0, 1)
          else this.selectedItem[type].splice(1, 1)
        }
      } else {
        if(this.selectedItem[type].length === 2) {
          this.showCueMessage = true
          return
        }
        else {
          this.selectedItem[type].push(item)
        }
      }
    },

    cancel: function() {
      this.onClose();
    },

    ok: function(type) {
      if(type === 'year') {
        this.model.selectedItem[type].data = this.selectedItem[type].sort(function(a, b) { return b.year - a.year })
      } else {
        this.model.selectedItem[type].data = this.selectedItem[type].sort(function(a, b) { return b.code - a.code })
      }

      this.model.period2 = this.selectedItem[type][0]
      this.model.period1 = this.selectedItem[type][1]
      this.onClose();
      this.service.cacheService.setCacheTimeperiod()
      nch.eventDispatcher.$emit('refreshdata');
    },

    onClose() {
      this.showTimePeriodOptions = false
      this.showCueMessage = false
      nch.eventDispatcher.$emit('timePeriodSelectorClosed');
    },

    itemUp: function() {
      if (this.scrollValue) {
        this.scrollValue --
      }
      document.getElementsByClassName('timeperiod-content')[0].scrollTop = 38 + 38 * this.scrollValue
    },

    itemDown: function() {
      if (this.scrollValue < this.arrayLength - 5) {
        this.scrollValue ++
      }
      document.getElementsByClassName('timeperiod-content')[0].scrollTop = 38 + 38 * this.scrollValue
    },

    handleScroll: function(e) {
      let currentScrollPosition = e.srcElement.scrollTop - 38
      if (currentScrollPosition < 0) {
        currentScrollPosition = 0
      }
      this.scrollValue =  Math.ceil (currentScrollPosition / 38)
    },

    yearUp: function() {
      if (this.selectedYear < this.maxYear) {
        this.selectedYear ++
      }
    },

    yearDown: function() {
      if (this.selectedYear > this.minYear) {
        this.selectedYear --
      }
    },

    filterMonths: function(year) {
      let months = {}
      this.monthOptions.map(function(o) {
        if ( parseInt(o.key, 10) === year )
          months = o
      })

      this.arrayLength = 0
      return months.values
    },

    filterWeeks: function(year) {
      let weeks = {}
      this.weekOptions.map(function(o) {
        if ( parseInt(o.key, 10) === year )
          weeks = o
      })

      this.arrayLength = weeks.values.length
      return weeks.values
    }
  }
}
