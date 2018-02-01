import * as d3 from 'd3'

export default class FilterService {
  constructor () {
    this.faceValues = []
  }

  getType () {
    return 'filter service'
  }

  getPieDataByCategoryFiltered (data, mediaCode, period) {
    var categoryList = this.getCategoryData(data)
    var mediaData = this.getDataForMediaCode(categoryList, mediaCode)
    return this.processPieDataByCategory(mediaData, period)
  }

  getPieDataByCategoryFilteredByClassOfTrade (data, classOfTradeCode, period) {
    var categoryList = this.getCategoryData(data)
    var mediaData = this.getDataForClassOfTrade(categoryList, classOfTradeCode)
    return this.processPieDataByCategory(mediaData, period)
  }

  getPieDataByPaperlessFaceValue (data, faceValueCode) {
    return this.getDataForPaperlessFaceValue(data, faceValueCode)
  }

  getPieDataByFaceValue (data, faceValue, period) {
    var categoryList = this.getCategoryData(data)
    var faceValueData = this.getDataForFaceValue(categoryList, faceValue)
    return this.processPieDataByMediaType(faceValueData, period)
  }

  getPieDataByClassOfTrade (data, period) {
    return this.processPieDataByClassOfTrade(data, period)
  }

  getPieDataByProductMoved (data, period) {
    return this.processProductMovedPieData(data, period)
  }

  getPieDataByCategory (data) {
    var categoryList = this.getCategoryData(data)
    return this.processPieDataByCategory(categoryList, -1)
  }

  getPieDataByMediaType (data) {
    var categoryList = this.getCategoryData(data)
    return this.processPieDataByMediaType(categoryList, -1)
  }

  getCategoryData (data) {
    var categoryData = []

    for (var i = 0; i < data.length; i++) {
      var item = data[i]

      if (nch.utils.inSelectedCategory(item)) {
        categoryData.push(item)
      }
    }

    return categoryData
  }

  getMarketData (data, marketCode) {
    var marketData = []

    for (var i = 0; i < data.length; i++) {
      var item = data[i]

      if (item['marketcode'] === marketCode) {
        marketData.push(item)
      }
    }

    return marketData
  }

  getDataForMediaCode (data, mediaCode) {
    var dataForMediaType = []

    for (var i = 0; i < data.length; i++) {
      var item = data[i]

      if (item.mediacode == mediaCode) {
        dataForMediaType.push(item)
        continue
      }
    }

    return dataForMediaType
  }

  getDataForClassOfTrade (data, classOfTradeCode) {
    var dataForMediaType = []

    for (var i = 0; i < data.length; i++) {
      var item = data[i]

      if (item.classoftradecode == classOfTradeCode) {
        dataForMediaType.push(item)
        continue
      }
    }

    return dataForMediaType
  }

  getDataForFaceValue (data, faceValue) {
    var dataForMediaType = []

    for (var i = 0; i < data.length; i++) {
      var item = data[i]

      if (item.facevalueperunitrangecode === faceValue || item.facevaluerangecode === faceValue) {
        dataForMediaType.push(item)
        continue
      }
    }

    return dataForMediaType
  }

  convertToPercentage(data) {
    var p1Total = 0
    var p2Total = 0
    var objectIds = Object.keys(data)

    // initialize data by media type first to ensure we include all media types (even with zero values
    for (var j = 0; j < objectIds.length; j++) {
      var key = objectIds[j]
      p1Total += data[key].totalredemptionsp1
      p2Total += data[key].totalredemptionsp2
    }

    for (var i = 0; i < objectIds.length; i++) {
      var key = objectIds[i]
      data[key].totalredemptionsp1 = p1Total === 0 ? 0 : data[key].totalredemptionsp1 / p1Total
      data[key].totalredemptionsp2 = p2Total === 0 ? 0 : data[key].totalredemptionsp2 / p2Total
    }

    return data;
  }

  getDataForPaperlessFaceValue (data, faceValue) {
    var dataForMediaType = []

    for (var i = 0; i < data.length; i++) {
      var item = data[i]
      if (item.facevaluerangecode === faceValue) {
        dataForMediaType.push(item)
        continue
      }
    }

    return dataForMediaType
  }

  processProductMovedPieData (data, period) {
    var groupedData = {}

    for (var i = 0; i < data.length; i++) {
      var item = data[i]

      var buyCount = item['couponbuycount']
      var freeCount = item['couponfreecount']
      var code = null
      var name = null
      var sortCode = -1

      if (buyCount === 0) {
        code = 'free'
        name = 'Free'
        sortCode = 100
      }
      else if (buyCount < 4 && freeCount === 0) {
        code = '' + buyCount + '-' + freeCount
        name = 'Buy ' + buyCount + ' Get ' + freeCount
        sortCode = buyCount
      }
      else if (buyCount > 3 && freeCount === 0) {
        code = '4+-0'
        name = 'Buy 4+ Get 0'
        sortCode = buyCount
      }
      else if (freeCount > 0 && buyCount > 0) {
        code = '1+-1+'
        name = 'Buy 1+ Get 1+'
        sortCode = 20
      }
      else {
        continue;
      }

      var currentData = null

      if (groupedData[code]) {
        currentData = groupedData[code]
      } else {
        currentData = {id: code, name: name, value: 0, sortCode: sortCode}
        groupedData[code] = currentData
      }

      if (period === 1) {
        currentData.value += item['productsmovedp1']
      }
      else if (period === 2) {
        currentData.value += item['productsmovedp2']
      }
      else {
        currentData.value += (item['productsmovedp1'] + item['productsmovedp2'])
      }
    }

    var list = []
    var dataIds = Object.keys(groupedData)

    for (var j = 0; j < dataIds.length; j++) {
      var dataId = dataIds[j]
      list.push(groupedData[dataId])
    }

    list.sort(function(a, b) {
      if (a.sortCode < b.sortCode) return -1
      if (a.sortCode > b.sortCode) return 1
      return 0
    })

    return list
  }

  processProductMoved (data, manufacturerCode) {
    var manufacturerName = nch.utils.getManufacturerName(manufacturerCode)
    var currentData = {id: manufacturerCode, name: manufacturerName, totalredemptionsp1: 0, totalredemptionsp2: 0}

    for (var i = 0; i < data.length; i++) {
      var item = data[i]

      if (!nch.utils.inSelectedCategory(item)) {
        continue
      }
      currentData.totalredemptionsp1 += item['productsmovedp1']
      currentData.totalredemptionsp2 += item['productsmovedp2']
    }

    if (currentData.totalredemptionsp1 === 0) {
      currentData.totalredemptionsp1 = 1
    }

    var currentPeriodValue = (currentData.totalredemptionsp2 / currentData.totalredemptionsp1) * 100
    currentData.totalredemptionsp2 = Math.round(currentPeriodValue)
    currentData.totalredemptionsp1 = 100
    return currentData
  }

  processRedemptionIndex (data, manufacturerCode) {
    var manufacturerName = nch.utils.getManufacturerName(manufacturerCode)
    var currentData = {id: manufacturerCode, name: manufacturerName, totalredemptionsp1: 0, totalredemptionsp2: 0}
    var couponDivisor
    for (var i = 0; i < data.length; i++) {
      var item = data[i]

      if (!nch.utils.inSelectedCategory(item)) {
        continue
      }

      couponDivisor = item['couponbuycount'] + item['couponfreecount']
      if (couponDivisor > 0) {
    	  currentData.totalredemptionsp1 += item['productsmovedp1']/couponDivisor
    	  currentData.totalredemptionsp2 += item['productsmovedp2']/couponDivisor
      }
    }

    if (currentData.totalredemptionsp1 === 0) {
      currentData.totalredemptionsp1 = 1
    }

    var currentPeriodValue = (currentData.totalredemptionsp2 / currentData.totalredemptionsp1) * 100
    currentData.totalredemptionsp2 = Math.round(currentPeriodValue)
    currentData.totalredemptionsp1 = 100
    return currentData
  }

  processProductMovedForOffset (data, manufacturerCode, offCode) {
    const offCodeValue = nch.utils.getOffCodeValue(offCode)
    const manufacturerName = nch.utils.getManufacturerName(manufacturerCode)
    const currentData = {id: manufacturerCode, name: manufacturerName, totalredemptionsp1: 0, totalredemptionsp2: 0}

    for (let i = 0; i < data.length; i++) {
      const item = data[i]

      if (!nch.utils.inSelectedCategory(item)) {
        continue
      }

      if (offCodeValue[1] === 0 && item['couponbuycount'] === offCodeValue[0] && item['couponfreecount'] === offCodeValue[1]) {
        currentData.totalredemptionsp1 += item['productsmovedp1']
        currentData.totalredemptionsp2 += item['productsmovedp2']
      } else if (offCodeValue[1] !== 0 && item['couponbuycount'] === offCodeValue[0] && item['couponfreecount'] > 0) {
        currentData.totalredemptionsp1 += item['productsmovedp1']
        currentData.totalredemptionsp2 += item['productsmovedp2']
      }
    }

    if (currentData.totalredemptionsp1 === 0) {
      currentData.totalredemptionsp1 = 1
    }

    let currentPeriodValue = (currentData.totalredemptionsp2 / currentData.totalredemptionsp1) * 100
    currentData.totalredemptionsp2 = Math.round(currentPeriodValue)
    currentData.totalredemptionsp1 = 100

    // if (currentData.totalredemptionsp2 < 100) {
    //   currentData.totalredemptionsp1 = 100 - currentData.totalredemptionsp2
    // }
    // else if (currentData.totalredemptionsp2 > 100) {
    //   currentData.totalredemptionsp1 = 100
    // }
    // else {
    //   currentData.totalredemptionsp2 = 100
    //   currentData.totalredemptionsp1 = 0
    // }
    return currentData
  }

  // ***** STATE DATA METHODS *************************************************

  filterStateData (stateList) {
    var min = 10000
    var max = -1
    const stateMap = {}
    const stateData = {min: 0, max: 0, states: stateMap}

    for (let i = 0; i < stateList.length; i++) {
      const item = stateList[i]
      var currentState = null
      var stateField = 'redemptionstate'
      const stateName = nch.utils.getStateName(item[stateField])

      if (stateName === null) {
        continue
      }

      if (stateMap[item[stateField]]) {
        currentState = stateMap[item[stateField]]
      } else {
        currentState = item
        currentState['name'] = item[stateField]


        // should be stateChange
        if( item['stateChange'] ) {
          currentState['redemptions'] = item['stateChange']
        }
        else if( item['storeRatiop1'] ) {
          currentState['redemptions'] = item['storeRatiop1'] + item['storeRatiop2']
        }
        else {
          currentState['redemptions'] = item['totalredemptionsp1'] + item['totalredemptionsp2']
        }

        stateMap[item[stateField]] = currentState
      }

      if (currentState.redemptions < min) {
        min = currentState.redemptions
      }

      if (currentState.redemptions > max) {
        max = currentState.redemptions
      }

    }

    stateData.min = min
    stateData.max = max
    return stateData
  }

  getState(stateAbbrev, states) {
    for( var i = 0; i < states.length; i++ ) {
      var state = states[i]

      if( stateAbbrev === state.name ) {
        return state
      }
    }

    return null;
  }

  // ***** FACE VALUE METHODS *************************************************

  addFaceValue (facevalue) {
    // don't allow duplicates
    for (var i = 0; i < this.faceValues.length; i++) {
      if (this.faceValues[i].code === facevalue.code) {
        return
      }
    }

    this.faceValues.push(facevalue)
  }

  getFaceValueLabel (faceValueCode) {
    for (var i = 0; i < this.faceValues.length; i++) {
      if (this.faceValues[i].code === faceValueCode) {
        return this.faceValues[i].label
      }
    }

    return null
  }

  // ***** BIPARTITE METHODS **************************************************

  processBipartiteData (items) {
    const list = []
    var map = {}
    var min = 1000000

    for (var i = 0; i < items.length; i++) {

      if( nch.utils.getStateName( items[i].state ) === null ) {
        continue
      }

      var value = items[i].totalredemptionsp2
      var formattedValue = d3.format('.0%')(value)

      if( formattedValue === '0%') {
        continue
      }

      if( value < min ) {
        min = value
      }

      var item = [
        nch.utils.getMediaAbbreviation(items[i].mediacodename),
        items[i].state,
        value
      ]

      list.push(item)
    }

    return list
  }

  // ***** MARKET METHODS *****************************************************

  processMarketData (data) {
    var groupedData = {}
    var codeFieldName = 'marketcode'
    var nameFieldName = 'marketname'

    for (var i = 0; i < data.length; i++) {
      var item = data[i]
      var currentData = null
      var code = item[codeFieldName]

      if (groupedData[code]) {
        currentData = groupedData[code]
      }
      else {
        currentData = {id: code, name: item[nameFieldName], marketratiop1: 0, marketratiop2: 0, marketchange: 0}
        groupedData[code] = currentData
      }

      currentData.marketchange += item['marketchange']
    }

    var list = []
    var dataIds = Object.keys(groupedData)

    for (var j = 0; j < dataIds.length; j++) {
      var dataId = dataIds[j]
      list.push(groupedData[dataId])
    }

    return list
  }

  // ***** PRIVATE HELPER METHODS *********************************************

  processPieDataByCategory (data, period) {
    return this.processGroupedData(data, period, 'categorycode', 'categoryname')
  }

  processPieDataByMediaType (data, period) {
    var mediaTypes = this.processGroupedData(data, period, 'mediacode', 'mediacodename')

    // **** must be in this order *****
    var sortArray = ["FSI", "Handout Electronic Checkout", "Print At Home", "Military", "Unknown"]
    return nch.utils.speicalSort(sortArray, mediaTypes, 'name')
  }

  processPieDataByClassOfTrade (data, period) {
    return this.processGroupedData(data, period, 'classoftradecode', 'classoftrade')
  }

  processGroupedData (data, period, codeFieldName, nameFieldName) {
    var groupedData = {}

    for (var i = 0; i < data.length; i++) {
      var item = data[i]
      var currentData = null
      var code = item[codeFieldName]

      if (groupedData[code]) {
        currentData = groupedData[code]
      }
      else {

        var nameValue = item[nameFieldName]
        currentData = {id: code, name: nameValue, value: 0}
        groupedData[code] = currentData
      }

      if (period == 1) {
        currentData.value += item['totalredemptionsp1']
      }
      else if (period == 2) {
        currentData.value += item['totalredemptionsp2']
      }
      else {
        currentData.value += (item['totalredemptionsp1'] + item['totalredemptionsp2'])
      }
    }

    var list = []
    var dataIds = Object.keys(groupedData)

    for (var j = 0; j < dataIds.length; j++) {
      var dataId = dataIds[j]
      list.push(groupedData[dataId])
    }

    return list
  }

  /**
   *  **** MARKED FOR DELETION *****
   * @param data
   * @param period
   * @returns {Array}
   */
  processMediaData(data, period) {
    var responseData = []

    var mediaTypeNames = nch.model.mediaTypeNames

    // initialize data by media type first to ensure we include all media types (even with zero values)
    // and in the correct order
    for (var j = 0; j < mediaTypeNames.length; j++) {
      var mediaName = mediaTypeNames[j]
      var mediaTypeId = nch.utils.getMediaCode( mediaName )

      if( mediaTypeId === -1 ) {
        continue
      }

      //var mediaLabel = nch.utils.getMediaAbbreviation(mediaName)
      var mediaData = {id: mediaTypeId, name: mediaName, value: 0}
      responseData.push( mediaData )
    }

    var codeFieldName = 'mediacode'

    for (var i = 0; i < data.length; i++) {
      var item = data[i]
      var currentData = null
      var code = item[codeFieldName]

      for (var k = 0; k < responseData.length; k++) {
        var dataItem = responseData[k]

        if( dataItem.id === code ) {
          currentData = dataItem
          continue
        }
      }

      // this should not happen
      if( currentData === null ) {
        continue
      }

      if (period == 1) {
        currentData.value += item['totalredemptionsp1']
      }
      else if (period == 2) {
        currentData.value += item['totalredemptionsp2']
      }
      else {
        currentData.value += (item['totalredemptionsp1'] + item['totalredemptionsp2'])
      }
    }

    return responseData
  }

  // ***** CATEGORY DATA ****************************************************

  processRedemptionsByCategoryAndMediaType (data) {
    var items = data
    var groupedData = {}
    var mediaTypes = {}

    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      var currentData = null

      // we only want selected categories
      if (!nch.utils.inSelectedCategory(item)) {
        continue
      }

      mediaTypes[item['mediacode']] = item['mediacodename']
      // this will group by category and media type for the table data
      var categoryMediaId = '' + item['categorycode'] + '' + item['mediacode']

      if (groupedData[categoryMediaId]) {
        currentData = groupedData[categoryMediaId]
      }
      else {
        currentData = {
          categorycode: item['categorycode'],
          categoryname: item['categoryname'],
          mediacode: item['mediacode'],
          mediacodename: item['mediacodename'],
          totalredemptionsp1: 0,
          totalredemptionsp2: 0
        }
        groupedData[categoryMediaId] = currentData
      }

      currentData.totalredemptionsp1 += item['totalredemptionsp1']
      currentData.totalredemptionsp2 += item['totalredemptionsp2']
    }

    // console.log('Filter service mediaTypes')
    // console.log(mediaTypes)
    nch.model.mediaTypes = mediaTypes // store for future use, this is a list of Objects :id => :name
    return groupedData
  }
}
