import services from '../../modules/services'
import moment from 'moment/moment'
import * as d3 from 'd3'

export default class TimePeriodService {

  constructor() {
    this.init();
  }

  init() {
    this.timePeriods = []
    this.years = []
    this.months = []
    this.weeks = []
    this.quarters = []

    if (process.env.NODE_ENV === 'development') {
      services.loadTimePeriodData().then( (response) => {
        this.timePeriods = response
        this.timePeriods = this.timePeriods.sort( this.fieldSorter( ['year', 'quarter','month','week'] ) )
        nch.eventDispatcher.$emit('timePeriodDataLoaded');
        console.log('Time period data loaded, total records: ' + this.timePeriods.length )
      }).catch( (message) => {
        console.log('TimePeriodService, loadTimePeriodData promise catch:' + message)
      })
    } else {
      services.loadRemoteTimePeriodData().then( (response) => {
        this.timePeriods = response
        this.timePeriods = this.timePeriods.sort( this.fieldSorter( ['year', 'quarter','month','week'] ) )
        nch.eventDispatcher.$emit('timePeriodDataLoaded');
        console.log('*Remote* Time period data loaded, total records: ' + this.timePeriods.length )
      }).catch( (message) => {
        console.log('TimePeriodService, remote loadTimePeriodData promise catch:' + message)
        nch.model.alertMessage.push( 'Unable to load Time Periods' )
        nch.model.showAlert = true
      })
    }
  }


  fieldSorter(fields) {
    return (a, b) => fields.map(o => {
      let dir = 1;
      if (o[0] === '-') { dir = -1; o=o.substring(1); }
      return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
    }).reduce((p,n) => p ? p : n, 0);
  }

  getYears() {
    if( this.years.length === 0 ) {
      for( let i = 0; i < this.timePeriods.length; i++ ) {
        if( this.timePeriods[i].quarter === 0 && this.timePeriods[i].month === 0 && this.timePeriods[i].week === 0 ) {
          this.timePeriods[i].type = 'year'
          this.years.push(this.timePeriods[i])
        }
      }
      this.years.sort(function(a, b) { return b.year - a.year })
    }
    return this.years
  }

  getQuarters() {
    if( this.quarters.length === 0 ) {
      let lastQtr = 0;
      for( let i = 0; i < this.timePeriods.length; i++ ) {

        if( this.timePeriods[i].quarter > 0  && this.timePeriods[i].quarter !== lastQtr) {
          lastQtr = this.timePeriods[i].quarter
          this.timePeriods[i].type = 'quarter'
          this.quarters.push(this.timePeriods[i])
        }
      }

      this.quarters = (d3.nest()
        .key(function(d) { return d.year })
        .entries(this.quarters)).sort(function(a, b) { return b.key - a.key })
    }

    return this.quarters
  }

  getMonths() {
    if( this.months.length === 0 ) {
      let lastMonth = 0;
      for( let i = 0; i < this.timePeriods.length; i++ ) {
        if( this.timePeriods[i].month > 0 && lastMonth !== this.timePeriods[i].month ) {
          lastMonth = this.timePeriods[i].month
          let currentDay = moment().set({'year': this.timePeriods[i].year, 'month': this.timePeriods[i].month - 1})
          let firstDay = currentDay.startOf('month').date()
          let lastDay = currentDay.endOf('month').date()
          this.months.push({
            'type': 'month',
            'year': this.timePeriods[i].year,
            'month': this.timePeriods[i].month,
            'id': this.timePeriods[i].code,
            'code': this.timePeriods[i].code,
            'tooltip': this.timePeriods[i].month + '/' + firstDay + '/' + this.timePeriods[i].year + '-' + this.timePeriods[i].month + '/' + lastDay + '/' + this.timePeriods[i].year
          })
        }
      }

      this.months = (d3.nest()
        .key(function(d) { return d.year })
        .key(function(d) { return d.month })
        .entries(this.months))
        .sort(function(a, b) { return b.key - a.key })

      this.months.map(function(v) {
        v.values.sort(function(a, b) { return b.key - a.key })
      })
    }
    return this.months
  }

  getWeeks() {
    if( this.weeks.length === 0 ) {
      for( let i = 0; i < this.timePeriods.length; i++ ) {
        if( this.timePeriods[i].week > 0 ) {
          var weekMetadata = this.getWeekMetadata( this.timePeriods[i] )

          if( weekMetadata !== null ) {
            this.timePeriods[i].type = 'week'
            this.timePeriods[i].monthInYear = weekMetadata.RptMonth - 1
            this.timePeriods[i].weekInMonth = weekMetadata.WeekInMonth
            this.timePeriods[i].tooltip = weekMetadata.EndDate
            this.weeks.push(this.timePeriods[i])
          }
        }
      }

      this.weeks = (d3.nest()
        .key(function(d) { return d.year })
        .key(function(d) { return d.monthInYear })
        .entries(this.weeks))
        .sort(function(a, b) { return b.key - a.key })

      this.weeks.map(function(v) {
        v.values.sort(function(a, b) { return b.key - a.key })
      })
    }
    return this.weeks
  }

  getWeekMetadata( timeObject ) {
    for( let i = 0; i < nch.model.weekData.length; i++ ) {
      var weekMetadata = nch.model.weekData[i]

      if (timeObject.year === weekMetadata.RptYear && timeObject.week === weekMetadata.RptWeek) {
        return weekMetadata
      }
    }

    return null
  }

  getLatestYear() {
    var yearValue = 0
    var latestYear = null

    for( let i = 0; i < this.years.length; i++ ) {
      var yearObject = this.years[i]

      if( yearObject.year > yearValue ) {
        yearValue = yearObject.year
        latestYear = yearObject
      }
    }

    return latestYear
  }

  findYearObject( yearValue ) {
    for( let i = 0; i < this.years.length; i++ ) {
      var yearObject = this.years[i]

      if( yearObject.year === yearValue ) {
        return yearObject
      }
    }

    return null
  }

  getLatestWeek( yearValue ) {
    var weekValue = 0
    var latestWeek = null

    for( let i = 0; i < this.timePeriods.length; i++ ) {
      if( this.timePeriods[i].week === 0 ) {
        continue
      }

      var weekObject = this.timePeriods[i]

      if( weekObject.year === yearValue && weekObject.week > weekValue ) {
        weekValue = weekObject.week
        latestWeek = weekObject
      }
    }

    return latestWeek
  }
}
