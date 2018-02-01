export default class DataService {

  getType() {
    return 'data service'
  }

  // ***** MEDIA TYPE DATA ****************************************************

  processRedemptionsByMedia(data) {
    var items = data;
    var responseData = {}

    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      var currentData = null

      // we only want selected categories
      if (!nch.utils.inSelectedCategory(item)) {
        continue;
      }

      if (responseData[item['mediacode']]) {
        currentData = responseData[item['mediacode']]
      }
      else {
        var mediaLabel = nch.utils.getMediaAbbreviation(item['mediacodename'])
        currentData = {id: item['mediacode'], name: mediaLabel, totalredemptionsp1: 0, totalredemptionsp2: 0}
        responseData[item['mediacode']] = currentData
      }

      currentData.totalredemptionsp1 += item['totalredemptionsp1']
      currentData.totalredemptionsp2 += item['totalredemptionsp2']
    }

    return responseData;
  }

  processRedemptionsByMediaForCategory(data, category) {
    var items = data;
    var responseData = {}

    var mediaTypeIds = Object.keys(nch.model.mediaTypes)

    // initialize data by media type first to ensure we include all media types (even with zero values
    for (var j = 0; j < mediaTypeIds.length; j++) {
      var mediaTypeId = mediaTypeIds[j]
      var mediaName = nch.model.mediaTypes[mediaTypeId]
      var mediaLabel = nch.utils.getMediaAbbreviation(mediaName)
      var mediaData = {id: mediaTypeId, name: mediaLabel, totalredemptionsp1: 0, totalredemptionsp2: 0}
      responseData[mediaTypeId] = mediaData
    }

    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      var currentData = null

      // we only want a specific categories
      if (category !== item.categorycode) {
        continue
      }

      if (responseData[item['mediacode']]) {
        currentData = responseData[item['mediacode']]
      }
      // else {
      //   var mediaLabel = nch.utils.getMediaAbbreviation(item['mediacodename'])
      //   currentData = {id: item['mediacode'], name: mediaLabel, totalredemptionsp1: 0, totalredemptionsp2: 0}
      //   responseData[item['mediacode']] = currentData
      // }

      currentData.totalredemptionsp1 += item['totalredemptionsp1']
      currentData.totalredemptionsp2 += item['totalredemptionsp2']
    }

    return responseData;
  }

  // ***** NIELSEN DATA ****************************************************

  processRedemptionsByMarket(data) {
    return data;
  }

  processRedemptionsByMarketMedia(data) {
    let responseData = {}

    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      let currentData = null
      if (responseData[item['mediacode']]) {
        currentData = responseData[item['mediacode']]
      }
      else {
        const mediaLabel = nch.utils.getMediaAbbreviation(item['mediacodename'])
        currentData = {id: item['mediacode'], name: mediaLabel, totalredemptionsp1: 0, totalredemptionsp2: 0}
        responseData[item['mediacode']] = currentData
      }

      currentData.totalredemptionsp1 += item['totalredemptionsp1']
      currentData.totalredemptionsp2 += item['totalredemptionsp2']
    }
    return responseData;
  }

  // ***** CLASS OF TRADES ****************************************************

  processRedemptionsByClassOfTrade(data) {
    var items = data;
    var responseData = {}

    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      var currentData = null

      // we only want selected categories
      if (!nch.utils.inSelectedCategory(item)) {
        continue;
      }

      if (responseData[item['classoftradecode']]) {
        currentData = responseData[item['classoftradecode']]
      }
      else {
        var label = nch.utils.getClassOfTradeAbbreviation(item['classoftrade']);
        currentData = {id: item['classoftradecode'], name: label, totalredemptionsp1: 0, totalredemptionsp2: 0}
        responseData[item['classoftradecode']] = currentData
      }

      currentData.totalredemptionsp1 += item['totalredemptionsp1']
      currentData.totalredemptionsp2 += item['totalredemptionsp2']
    }

    return responseData;
  }

  processRedemptionsByClassOfTradeForCategory(data, categoryCode) {
    var items = data;
    var responseData = {}

    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      var currentData = null

      // we only want a specific categories
      if (categoryCode != item.categorycode) {
        continue
      }

      if (responseData[item['classoftradecode']]) {
        currentData = responseData[item['classoftradecode']]
      }
      else {
        var label = nch.utils.getClassOfTradeAbbreviation(item['classoftrade']);
        currentData = {id: item['classoftradecode'], name: label, totalredemptionsp1: 0, totalredemptionsp2: 0}
        responseData[item['classoftradecode']] = currentData
      }

      currentData.totalredemptionsp1 += item['totalredemptionsp1']
      currentData.totalredemptionsp2 += item['totalredemptionsp2']
    }

    return responseData;
  }

  // ***** FACE VALUE DATA ****************************************************

  processFaceValueData(data, manufacturerCode, codeField, nameField) {
    var faceValueData = {};
    var totalP1Redemptions = 0;
    var totalP2Redemptions = 0;

    for (var i = 0; i < data.length; i++) {

      var item = data[i];
      var currrentFaceValue = null;

      if (!nch.utils.inSelectedCategory(item)) {
        continue;
      }

      if (item[codeField] !== 1 && item[codeField] !== 2 && item[codeField] !== 3 && item[codeField] !== 4) {
        continue;
      }

      if (faceValueData[item[codeField]]) {
        currrentFaceValue = faceValueData[item[codeField]]
      }
      else {
        currrentFaceValue = {
          code: item[codeField],
          name: item[nameField],
          total: 1,
          manufacturerCode: manufacturerCode,
          manufacturer: nch.utils.getManufacturerName(manufacturerCode),
          p1Redemptions: 0,
          p2Redemptions: 0,
          p1Label: nch.utils.getTimePeriodLabel(nch.model.period1),
          p1: 1,
          p2Label: nch.utils.getTimePeriodLabel(nch.model.period2),
          p2: 2
        }

        nch.services.filterService.addFaceValue({code: currrentFaceValue.code, label: currrentFaceValue.name})
        faceValueData[item[codeField]] = currrentFaceValue
      }

      var p1RedemptionValue = Number(item['totalredemptionsp1']);
      var p2RedemptionValue = Number(item['totalredemptionsp2']);

      if (!isNaN(p1RedemptionValue)) {
        currrentFaceValue.p1Redemptions += p1RedemptionValue;
        totalP1Redemptions += p1RedemptionValue;
      }

      if (!isNaN(p2RedemptionValue)) {
        currrentFaceValue.p2Redemptions += p2RedemptionValue;
        totalP2Redemptions += p2RedemptionValue;
      }

    }

    var faceValues = Object.keys(faceValueData);

    for (var j = 0; j < faceValues.length; j++) {
      var faceValuesCode = faceValues[j];
      var faceValueObject = faceValueData[faceValuesCode]
      var faceValuePercentage = faceValueObject.p1Redemptions / totalP1Redemptions
      faceValueObject['p1Percentage'] = faceValuePercentage;

      var faceValuePercentage2 = faceValueObject.p2Redemptions / totalP2Redemptions
      faceValueObject['p2Percentage'] = faceValuePercentage2;
    }
    return faceValueData;
  }

  processFaceValueDataByMedia( data, manufacturerCode, mediaCode, isRange ) {
    var faceValueData = {};
    var totalP1Redemptions = 0;
    var totalP2Redemptions = 0;

    for( var i = 0; i < data.length; i++ ) {

      var item = data[i];
      var currrentFaceValue = null;

      if( !nch.utils.inSelectedCategory( item ) ) {
        continue;
      }

      var codeField = isRange ? 'facevaluerangecode' : 'facevalueperunitrangecode';

      if( (item[codeField] !== 1 && item[codeField] !== 2 && item[codeField] !== 3 && item[codeField] !== 4) || item['mediacode'] !== mediaCode ) {
        continue;
      }
      if( faceValueData[ item[codeField] ] ) {
        currrentFaceValue = faceValueData[ item[codeField] ]
      } else {
        currrentFaceValue = {
          code: item[codeField],
          name: isRange ? item['facevaluerangedescription'] : item['facevalueperunitrangedescription'],
          total: 1,
          manufacturerCode: manufacturerCode,
          manufacturer: nch.utils.getManufacturerName( manufacturerCode ),
          p1Redemptions: 0,
          p2Redemptions: 0,
          p1Label: nch.utils.getTimePeriodLabel(nch.model.period1),
          p1: nch.model.period1.code,
          p2Label: nch.utils.getTimePeriodLabel(nch.model.period2),
          p2: nch.model.period2.code
        }

        nch.services.filterService.addFaceValue( {code: currrentFaceValue.code, label: currrentFaceValue.name })
        faceValueData[ item[codeField] ] = currrentFaceValue
      }
      var p1RedemptionValue =  Number(item['totalredemptionsp1']);
      var p2RedemptionValue =  Number(item['totalredemptionsp2']);

      if( !isNaN(p1RedemptionValue) ) {
        currrentFaceValue.p1Redemptions += p1RedemptionValue;
        totalP1Redemptions += p1RedemptionValue;
      }

      if( !isNaN(p2RedemptionValue) ) {
        currrentFaceValue.p2Redemptions += p2RedemptionValue;
        totalP2Redemptions += p2RedemptionValue;
      }

    }

    var faceValues = Object.keys( faceValueData );
    for( var j = 0; j < faceValues.length; j++ ) {
      var faceValuesCode = faceValues[j];
      var faceValueObject = faceValueData[faceValuesCode]
      var faceValuePercentage = faceValueObject.p1Redemptions/totalP1Redemptions
      faceValueObject['p1Percentage'] = faceValuePercentage;

      var faceValuePercentage2 = faceValueObject.p2Redemptions/totalP2Redemptions
      faceValueObject['p2Percentage'] = faceValuePercentage2;
    }

    return faceValueData;
  }

  processFaceValueDataByCategory( data, manufacturerCode, categoryCode ) {
    var faceValueData = {};
    var totalP1Redemptions = 0;
    var totalP2Redemptions = 0;

    for( var i = 0; i < data.length; i++ ) {

      var item = data[i];
      var currrentFaceValue = null;

      if( !nch.utils.inSelectedCategory( item ) ) {
        continue;
      }

      var codeField = 'facevalueperunitrangecode'
      if( (item[codeField] !== 1 && item[codeField] !== 2 && item[codeField] !== 3 && item[codeField] !== 4) || item['classoftradecode'] !== categoryCode ) {
        continue;
      }

      if( faceValueData[ item[codeField] ] ) {
        currrentFaceValue = faceValueData[ item[codeField] ]
      } else {
        currrentFaceValue = {
          code: item[codeField],
          name: item['facevalueperunitrangedescription'],
          total: 1,
          manufacturerCode: manufacturerCode,
          manufacturer: nch.utils.getManufacturerName( manufacturerCode ),
          p1Redemptions: 0,
          p2Redemptions: 0,
          p1Label: nch.utils.getTimePeriodLabel(nch.model.period1),
          p1: nch.model.period1.code,
          p2Label: nch.utils.getTimePeriodLabel(nch.model.period2),
          p2: nch.model.period2.code
        }

        nch.services.filterService.addFaceValue( {code: currrentFaceValue.code, label: currrentFaceValue.name })
        faceValueData[ item[codeField] ] = currrentFaceValue
      }
      var p1RedemptionValue =  Number(item['totalredemptionsp1']);
      var p2RedemptionValue =  Number(item['totalredemptionsp2']);

      if( !isNaN(p1RedemptionValue) ) {
        currrentFaceValue.p1Redemptions += p1RedemptionValue;
        totalP1Redemptions += p1RedemptionValue;
      }

      if( !isNaN(p2RedemptionValue) ) {
        currrentFaceValue.p2Redemptions += p2RedemptionValue;
        totalP2Redemptions += p2RedemptionValue;
      }

    }

    var faceValues = Object.keys( faceValueData );
    for( var j = 0; j < faceValues.length; j++ ) {
      var faceValuesCode = faceValues[j];
      var faceValueObject = faceValueData[faceValuesCode]
      var faceValuePercentage = faceValueObject.p1Redemptions/totalP1Redemptions
      faceValueObject['p1Percentage'] = faceValuePercentage;

      var faceValuePercentage2 = faceValueObject.p2Redemptions/totalP2Redemptions
      faceValueObject['p2Percentage'] = faceValuePercentage2;
    }

    return faceValueData;
  }

  formatFaceValueData(manufacturerFaceValues, comparableFaceValues) {
    var manufacturer = {
      label: nch.model.manufacturer.name,
      data: manufacturerFaceValues
    }

    var comparables = {
      label: 'Comparables',
      data: comparableFaceValues
    }

    return { manufacturer: manufacturer, comparables: comparables }
  }

  getOtherMarketData( manufacturerCode, market, marketType ) {
    let marketData = null;

    if( manufacturerCode === 'ALL' || manufacturerCode === 'Comparables' ) {
      marketData = nch.services.marketService.getGeoData( nch.model.manufacturer.code, marketType )
    }
    else {
      marketData = nch.services.marketService.getGeoData( 'ALL', marketType )
    }

    return marketData.filter(function(d) { return d.id === market.id && d.name === market.name })
  }

  getOtherPaperlessMarketData( manufacturerCode, market, marketType ) {
    let marketData = null;

    if( manufacturerCode === 'ALL' || manufacturerCode === 'Comparables' ) {
      marketData = nch.services.marketService.getPaperlessGeoData( nch.model.manufacturer.code, marketType )
    }
    else {
      marketData = nch.services.marketService.getPaperlessGeoData( 'ALL', marketType )
    }

    return marketData.filter(function(d) { return d.id === market.id && d.name === market.name })
  }
}
