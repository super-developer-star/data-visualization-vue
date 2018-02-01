const utils = {
  stateList () {
    return [
      ['Arizona', 'AZ'],
      ['Alabama', 'AL'],
      ['Alaska', 'AK'],
      ['Arizona', 'AZ'],
      ['Arkansas', 'AR'],
      ['California', 'CA'],
      ['Colorado', 'CO'],
      ['Connecticut', 'CT'],
      ['Delaware', 'DE'],
      ['Florida', 'FL'],
      ['Georgia', 'GA'],
      ['Hawaii', 'HI'],
      ['Idaho', 'ID'],
      ['Illinois', 'IL'],
      ['Indiana', 'IN'],
      ['Iowa', 'IA'],
      ['Kansas', 'KS'],
      ['Kentucky', 'KY'],
      ['Kentucky', 'KY'],
      ['Louisiana', 'LA'],
      ['Maine', 'ME'],
      ['Maryland', 'MD'],
      ['Massachusetts', 'MA'],
      ['Michigan', 'MI'],
      ['Minnesota', 'MN'],
      ['Mississippi', 'MS'],
      ['Missouri', 'MO'],
      ['Montana', 'MT'],
      ['Nebraska', 'NE'],
      ['Nevada', 'NV'],
      ['New Hampshire', 'NH'],
      ['New Jersey', 'NJ'],
      ['New Mexico', 'NM'],
      ['New York', 'NY'],
      ['North Carolina', 'NC'],
      ['North Dakota', 'ND'],
      ['Ohio', 'OH'],
      ['Oklahoma', 'OK'],
      ['Oregon', 'OR'],
      ['Pennsylvania', 'PA'],
      ['Rhode Island', 'RI'],
      ['South Carolina', 'SC'],
      ['South Dakota', 'SD'],
      ['Tennessee', 'TN'],
      ['Texas', 'TX'],
      ['Utah', 'UT'],
      ['Vermont', 'VT'],
      ['Virginia', 'VA'],
      ['Washington', 'WA'],
      ['West Virginia', 'WV'],
      ['Wisconsin', 'WI'],
      ['Wyoming', 'WY']
    ]
  },

  getStateAbbrev (stateName) {
    const states = this.stateList()
    stateName = stateName.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
    for (let i = 0; i < states.length; i++) {
      if (states[i][0] === stateName) {
        return (states[i][1])
      }
    }

    return null
  },

  getStateName (stateAbbrev) {
    const states = this.stateList()
    stateAbbrev = stateAbbrev.toUpperCase()
    for (let i = 0; i < states.length; i++) {
      if (states[i][1] === stateAbbrev) {
        return (states[i][0])
      }
    }

    return null
  },

  getCurrentWeek (date) {
    if (!(date instanceof Date)) {
      date = new Date()
    }
    const nDay = (date.getDay() + 6) % 7
    date.setDate(date.getDate() - nDay + 3)

    const n1stThursday = date.valueOf()

    date.setMonth(0, 1)

    if (date.getDay() !== 4) {
      date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7)
    }

    return 1 + Math.ceil((n1stThursday - date) / 604800000)
  },

  getRollingWeeksRanges (date) {
    if (!(date instanceof Date)) {
      date = new Date()
    }
    const endClosedWeek = this.getCurrentWeek(date) - 1
    let endYear = date.getFullYear()
    let startClosedWeek = endClosedWeek
    let startYear = date.getFullYear() - 1

    if (endClosedWeek === 52) {
      endYear = date.getFullYear() - 1
    }

    if (startClosedWeek === 52) {
      startClosedWeek = 1
      endYear = date.getFullYear()
    }

    const ranges = {
      'start': {
        'week': startClosedWeek,
        'year': startYear
      },
      'end': {
        'week': endClosedWeek,
        'year': endYear
      }
    }
    return ranges
  },

  getCurrentQuarter () {
    const quarter = Math.floor((date.getMonth() + 3) / 3)
    return quarter
  },

  getLastQuarter () {
    let lastQ = this.getCurrentQuarter() - 1
    let Qyear = date.getFullYear()
    if (lastQ === 0) {
      lastQ = 1
      Qyear = date.getFullYear() - 1
    }
    let quarter = {'quarter': lastQ, 'year': Qyear}
  },

  getClosedQuarterRanges (date) {
    if (!(date instanceof Date)) {
      date = new Date()
    }
    // TODO startQuarter:: will get this from service soon
    let startQuarter = {'quarter': 1, 'year': 2015}
    let endQuarter = this.getLastQuarter()
    let quarterRanges = {'start': startQuarter, 'end': endQuarter}
  },

  getClosedMonthsRanges (date) {
    if (!(date instanceof Date)) {
      date = new Date()
    }
    // TODO startMonth:: will get this from service soon
    // let startMonth = { 'month': 1, 'year': 2015 }
    let endMonth = date.getMonth() - 1
    let Myear = date.getFullYear()
    if (endMonth === 0) {
      endMonth = 12
      Myear = date.getFullYear() - 1
    }
    endMonth = {'month': endMonth, 'year': Myear}
    // let MonthRanges = { 'start': startMonth, 'end': endMonth }
  },

  getTimePeriodCode(timePeriod) {
    if (timePeriod === undefined) {
      return -1
    }

    if (timePeriod.code === undefined || timePeriod.code === 0) {
      return timePeriod.year
    }

    return timePeriod.code
  },

  getTimePeriodLabel(timePeriod) {

    if (timePeriod === undefined) {
      return ''
    }

    if (timePeriod.type === 'quarter') {
      return timePeriod.year + ' Q' + timePeriod.quarter
    }
    else if (timePeriod.type === 'month') {
      var monthName = nch.utils.getMonth(timePeriod.month)
      return monthName + ' ' + timePeriod.year
    }
    else if (timePeriod.type === 'week') {
      //return timePeriod.year + ' ' + (nch.utils.getMonth(timePeriod.monthInYear + 1)) + ' Wk' + timePeriod.weekInMonth
      return (nch.utils.getMonth(timePeriod.monthInYear + 1)) + ' Wk' + timePeriod.weekInMonth
    }
    else if (nch.model.selectedTimePeriod === 'ytd' ) {
      return '' + timePeriod.year + ' YTD'
    }
    else {
      return '' + timePeriod.year
    }
  },

  getMediaAbbreviation(mediaType) {
    if (mediaType === 'Handout Electronic Checkout') {
      return 'HOEC'
    } else if (mediaType === 'Unknown') {
      return 'Other Paper'
    } else if(mediaType === 'Print At Home') {
      return 'Print@Home'
    }
    else {
      return mediaType
    }
  },

  getManufacturerName(manufacturerCode) {
    return manufacturerCode === 'ALL' ? 'Comparables' : nch.model.manufacturer.name
  },

  getManufacturerCode(manufacturerName) {
    return manufacturerName === 'Comparables' ? 'ALL' : nch.model.manufacturer.code
  },

  getMediaCode(mediaName) {
    var mediaCodes = Object.keys(nch.model.mediaTypes)

    for (var j = 0; j < mediaCodes.length; j++) {
      var mediaCode = mediaCodes[j]

      if (nch.model.mediaTypes[mediaCode] === mediaName) {
        return mediaCode
      }
      else if (nch.model.mediaTypes[mediaCode] === 'Unknown' && mediaName === 'Other Paper') {
        return mediaCode
      }
    }

    return -1
  },

  inSelectedCategory(item) {
    if (item.categorycode === undefined) {
      return true
    }

    for (var j = 0; j < nch.model.selectedCategories.length; j++) {

      if (item.categorycode === nch.model.selectedCategories[j].categorycode) {
        return true
      }
    }

    return false
  },

  getMarketLabel( marketType ) {
    if (marketType === 'iri') {
      return 'IRI'
    }
    else if (marketType === 'dma') {
      return 'DMA'
    }

    return 'Nielsen'
  },

  getOffCodeValue(offCode) {
    let offCodeValue = offCode.split('-')
    offCodeValue[0] = isNaN(Number(offCodeValue[0])) ? Number('-1') : Number(offCodeValue[0])
    offCodeValue[1] = isNaN(Number(offCodeValue[1])) ? Number('-1') : Number(offCodeValue[1])
    return offCodeValue
  },

  getClassOfTradeAbbreviation(classOfTrade) {
    if (classOfTrade == 'LARGE DRUG/PHARM' || classOfTrade == 'DRUG STORES') {
      return 'Drug'
    }
    else if (classOfTrade == 'LARGE SUPERMARKET' || classOfTrade == 'GROCERY STORES') {
      return 'Grocery'
    }
    else if (classOfTrade == 'CLEARING HOUSE') {
      return 'Clearing House'
    }
    else if (classOfTrade == 'MASS MERCHANDISER' || classOfTrade == 'MASS MERCHANDISERS') {
      return 'Mass'
    }
    else if (classOfTrade == 'MILITARY' || classOfTrade == 'MILITARY COMMISSARIES') {
      return 'Military'
    }
    else if (classOfTrade == 'OTHER OUTLET') {
      return 'Other'
    }
    else {
      return classOfTrade
    }
  },

  getMarketUrl(manufacturerCode, marketType){
    if (manufacturerCode === 'ALL' || manufacturerCode === 'Comparables' || manufacturerCode === undefined) {
      manufacturerCode = '~' + nch.model.manufacturer.code
    }

    var url = null

    if (marketType === 'dma') {
      url = '/crunch/redemptionsbydmamarket?manufacturer=' + manufacturerCode
    }
    else if (marketType === 'iri') {
      url = '/crunch/redemptionsbyirimarket?manufacturer=' + manufacturerCode
    }
    else {
      url = '/crunch/redemptionsbynielsenmarket?manufacturer=' + manufacturerCode
    }

    return url
  },

  getPaperlessMarketUrl(manufacturerCode, marketType){
    if (manufacturerCode === 'ALL' || manufacturerCode === 'Comparables' || manufacturerCode === undefined) {
      manufacturerCode = '~' + nch.model.manufacturer.code
    }

    var url = null

    if (marketType === 'dma') {
      url = '/crunch/redemptionspaperlessbydmamarket?manufacturer=' + manufacturerCode
    }
    else if (marketType === 'iri') {
      url = '/crunch/redemptionspaperlessbyirimarket?manufacturer=' + manufacturerCode
    }
    else {
      url = '/crunch/redemptionspaperlessbynielsenmarket?manufacturer=' + manufacturerCode
    }

    return url
  },

  getMarketByMediaUrl(manufacturerCode, marketType){
    if (manufacturerCode === 'ALL' || manufacturerCode === 'Comparables' || manufacturerCode === undefined) {
      manufacturerCode = '~' + nch.model.manufacturer.code
    }

    var url = null

    if (marketType === 'dma') {
      url = '/crunch/redemptionsbydmabymedia?manufacturer=' + manufacturerCode
    }
    else if (marketType === 'iri') {
      url = '/crunch/redemptionsbyiribymedia?manufacturer=' + manufacturerCode
    }
    else {
      url = '/crunch/redemptionsbynielsenbymedia?manufacturer=' + manufacturerCode
    }

    return url
  },

  appendCategories(url) {
    for (var j = 0; j < nch.model.selectedCategories.length; j++) {
      var categoryCode = nch.model.selectedCategories[j].categorycode
      url += ('&cat=' + categoryCode)
    }

    return url
  },

  appendFilters(dataUrl) {
    dataUrl += ('&segment=' + nch.model.selectedSegmentCode)

    // selected sector had been removed, pull this from the first selected category
    if (nch.model.selectedCategories.length > 0) {
      var category = nch.model.selectedCategories[0]
      dataUrl += ('&sector=' + category.sectorcode)
    }

    dataUrl += ('&year1=' + nch.model.period1.year)
    dataUrl += ('&year2=' + nch.model.period2.year)

    if (nch.model.selectedTimePeriod === 'quarter') {
      dataUrl += ('&q1=' + nch.model.period1.quarter)
      dataUrl += ('&q2=' + nch.model.period2.quarter)
    }
    else if (nch.model.selectedTimePeriod === 'week') {
      dataUrl += ('&w1=' + nch.model.period1.week)
      dataUrl += ('&w2=' + nch.model.period2.week)
    }
    else if (nch.model.selectedTimePeriod === 'month') {
      dataUrl += ('&m1=' + nch.model.period1.month)
      dataUrl += ('&m2=' + nch.model.period2.month)
    }
    else if (nch.model.selectedTimePeriod === 'ytd') {
      dataUrl += ('&w1=1')
      var weekObject = nch.services.timePeriodService.getLatestWeek( nch.model.period2.year )
      dataUrl += ('&w2=' + weekObject.week)
      dataUrl += ('&range=true')
    }

    return dataUrl
  },

  getReadableValue(numberValue) {
    return numberValue < 0 ? numberValue * 1000000000 : numberValue
  },

  getMonth(monthIndex) {
    var monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return monthsName[monthIndex - 1]
  },

  getPeriodSuffixLabel(numberValue) {
    if (numberValue == 1) {
      return numberValue + 'st'
    }
    else if (numberValue == 2) {
      return numberValue + 'nd'
    }
    else if (numberValue == 3) {
      return numberValue + 'rd'
    }

    return numberValue + 'th'
  },

  startLoadingService(val) {
    if (nch.model.loadingServices.indexOf(val) < 0)
      nch.model.loadingServices.push(val)
  },

  endLoadingService(value) {
    const index = nch.model.loadingServices.indexOf(value)

    if (index > -1) {
      nch.model.loadingServices.splice(index, 1)
    }
  },

  speicalSort(orderValue, data, key) {
    let result = []
    for(let i = 0; i < orderValue.length; i++) {
      for(let j = 0; j < data.length; j++) {
        if(data[j][key] === orderValue[i]) {
          result.push(data[j])
          break
        }
      }
    }

    return result
  },

  addDollarSign(value) {
    if(value.indexOf('<') > -1) {
      return '< $' + Number(value.split('<')[1]).toFixed(2)
    } else if(value.indexOf('-') > -1) {
      return '$' + Number(value.split(' - ')[0]).toFixed(2) + ' - ' + '$' + Number(value.split(' - ')[1]).toFixed(2)
    } else if(value.indexOf('+') > -1) {
      return '$' + Number(value.split(' +')[0]).toFixed(2) + ' +'
    } else {
      return ''
    }
  },

//  Dashboard Table features
  getTotalByMediaType(category, period, groupedData) {
    var total = 0
    var mediaCodes = Object.keys(nch.model.mediaTypes)

    for (var j = 0; j < mediaCodes.length; j++) {
      var id = '' + category.categorycode + '' + mediaCodes[j]
      var currentObject = groupedData[id]

      if (currentObject !== undefined && currentObject !== null) {
        if (period == 1) {
          total += currentObject.totalredemptionsp1
        }
        else {
          total += currentObject.totalredemptionsp2
        }
      }
    }
    return total
  },

  trackPageViews( pagePath ) {
	 try {
		 ga('set', 'page', pagePath);
		 ga('send', 'pageview');
	 }catch(error){
		 // nothing at this point you do not want to block routing because of this
	 }
  },

  isDevelopment() {
    return process.env.NODE_ENV === 'development' || window.location.hostname.indexOf('-d1.harlandclarke.local') > 0
  }
}

module.exports = utils
