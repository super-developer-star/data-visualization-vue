import * as http from 'superagent'
import DataService from './DataService'

export default class RemoteDataService extends DataService {
  constructor() {
    super();
    this.manufacturerData = []
    this.comparableData = []
    this.manufacturerDataFVRange = []
    this.comparableDataFVRange = []
    this.manufacturerPaperlessData = []
    this.comparablePaperlessData = []
    this.comparableProductMovedData = []
    this.manufacturerProductMovedData = []
    this.manufacturerStateData = null;
    this.comparableStateData = null;
    this.manufacturerPaperlessStateData = null;
    this.comparablePaperlessStateData = null;

    // ensure no service calls are made until we have a sector
    if (nch.model.selectedSector !== null) {
      this.initRedemptionData();
    }

    this.initListeners();
  }

  getType() {
    return 'remote data service'
  }

  initListeners() {
    nch.eventDispatcher.$on('categoriesUpdated', () => {
      console.log('Categories changed, updating data')
      this.initRedemptionData()
      nch.eventDispatcher.$emit('dataRefreshed')
    })

    nch.eventDispatcher.$on('refreshdata', () => {
      console.log('Categories or time period changed, updating data')
      this.initRedemptionData()
      nch.eventDispatcher.$emit('dataRefreshed')
    })
  }

  initRedemptionData() {
    nch.status.redemptionsLoaded = false
    nch.status.productMovedLoaded = false
    nch.status.faceValueRangeLoaded = false
    nch.status.paperlessRedemptionsLoaded = false
    this.manufacturerData = []
    this.comparableData = []
    this.manufacturerDataFVRange = []
    this.comparableDataFVRange = []
    this.manufacturerPaperlessData = []
    this.comparablePaperlessData = []
    this.comparableProductMovedData = []
    this.manufacturerProductMovedData = []

    this.loadRedemptionData(nch.model.manufacturer.code).then((response) => {
      this.manufacturerData = response
      nch.model.manufacturerData = response
      console.log("Manufacturer data loaded via API, total records: " + this.manufacturerData.length)
      nch.status.redemptionsLoaded = this.manufacturerData.length > 0 && this.comparableData.length > 0
      nch.eventDispatcher.$emit('dataLoaded');
    }).catch((message) => {
      console.log('DataService, load manufacturer data promise catch:' + message)
      nch.model.alertMessage.push('Unable to load manufacturer data')
      nch.model.showAlert = true
    })

    this.loadRedemptionData('ALL').then((response) => {
      this.comparableData = response
      nch.model.comparableData = response;
      console.log("Comparable data loaded via API, total records: " + this.comparableData.length)
      nch.status.redemptionsLoaded = this.manufacturerData.length > 0 && this.comparableData.length > 0
      nch.eventDispatcher.$emit('dataLoaded');
    }).catch((message) => {
      console.log('DataService, load comparable data promise catch:' + message)
      nch.model.alertMessage.push('Unable to load comparable data')
      nch.model.showAlert = true
    })

    this.loadProductMovedData(nch.model.manufacturer.code).then((response) => {
      this.manufacturerProductMovedData = response
      nch.status.productMovedLoaded = this.manufacturerProductMovedData.length > 0 && this.comparableProductMovedData.length > 0
      console.log("Manufacturer product moved data loaded via API, total records: " + this.manufacturerProductMovedData.length)
    }).catch((message) => {
      console.log('DataService, load product moved manufacturer data promise catch:' + message)
      nch.model.alertMessage.push('Unable to load product moved manufacturer data')
      nch.model.showAlert = true
    })

    this.loadProductMovedData('ALL').then((response) => {
      this.comparableProductMovedData = response
      nch.status.productMovedLoaded = this.manufacturerProductMovedData.length > 0 && this.comparableProductMovedData.length > 0
      console.log("Comparable product moved data loaded via API, total records: " + this.comparableProductMovedData.length)
    }).catch((message) => {
      console.log('DataService, load product moved comparable data promise catch:' + message)
      nch.model.alertMessage.push('Unable to load product moved comparable data')
      nch.model.showAlert = true
    })

    this.loadPaperless(nch.model.manufacturer.code).then((response) => {
      this.manufacturerPaperlessData = response
      console.log("Manufacturer paperless data loaded via API, total records: " + this.manufacturerPaperlessData.length)
      nch.status.paperlessRedemptionsLoaded = this.manufacturerPaperlessData.length > 0 && this.comparablePaperlessData.length > 0
    }).catch((message) => {
      console.log('DataService, loadPaperless for manufacturer promise catch:' + message)
      nch.model.alertMessage.push('Unable to load paperless manufacturer data')
      nch.model.showAlert = true
    })

    this.loadPaperless('ALL').then((response) => {
      this.comparablePaperlessData = response
      console.log("Comparable paperless data loaded via API, total records: " + this.comparablePaperlessData.length)
      nch.status.paperlessRedemptionsLoaded = this.manufacturerPaperlessData.length > 0 && this.comparablePaperlessData.length > 0
    }).catch((message) => {
      console.log('DataService, loadPaperless for comparable promise catch:' + message)
      nch.model.alertMessage.push('Unable to load paperless comparable data')
      nch.model.showAlert = true
    })

    this.loadFaceValueRangeData()
  }

  // ***** MAIN REDEMPTION DATA ***********************************************

  getRedemptionData(manufacturerCode) {
    return manufacturerCode == 'ALL' ? this.comparableData : this.manufacturerData;
  }

  getRedemptionDataWithFVRange(manufacturerCode) {
    return manufacturerCode == 'ALL' ? this.comparableDataFVRange : this.manufacturerDataFVRange;
  }

  // ***** MEDIA TYPE DATA ****************************************************

  getRedemptionsByMedia(manufacturerCode) {
    return manufacturerCode == 'ALL' ? super.processRedemptionsByMedia(this.comparableData) :
      super.processRedemptionsByMedia(this.manufacturerData);
  }

  getRedemptionsByMediaForCategory(manufacturerCode, categoryCode) {
    return manufacturerCode == 'ALL' ? super.processRedemptionsByMediaForCategory(this.comparableData, categoryCode) :
      super.processRedemptionsByMediaForCategory(this.manufacturerData, categoryCode);
  }

  // ***** CLASS OF TRADES ****************************************************

  getRedemptionsByClassOfTrade(manufacturerCode) {
    return manufacturerCode == 'ALL' ? super.processRedemptionsByClassOfTrade(this.comparableData) :
      super.processRedemptionsByClassOfTrade(this.manufacturerData);
  }

  getRedemptionsByClassOfTradeForCategory(manufacturerCode, categoryCode) {
    return manufacturerCode == 'ALL' ? super.processRedemptionsByClassOfTradeForCategory(this.comparableData, categoryCode) :
      super.processRedemptionsByClassOfTradeForCategory(this.manufacturerData, categoryCode);
  }

  // ***** PRODUCT MOVED ******************************************************

  getProductMovedForManufacturerData(manufacturerCode) {
    return manufacturerCode == 'ALL' ? this.comparableProductMovedData : this.manufacturerProductMovedData;
  }

  // ***** FACE VALUE DATA ****************************************************

  getFaceValueData() {
    var manufacturerFaceValues = super.processFaceValueData(this.manufacturerData, nch.model.manufacturer.code, 'facevalueperunitrangecode', 'facevalueperunitrangedescription')
    var comparableFaceValues = super.processFaceValueData(this.comparableData, 'ALL', 'facevalueperunitrangecode', 'facevalueperunitrangedescription')
    return super.formatFaceValueData(manufacturerFaceValues, comparableFaceValues)
  }

  getFaceValueRangeData() {
    var manufacturerFaceValues = super.processFaceValueData(this.manufacturerDataFVRange, nch.model.manufacturer.code, 'facevaluerangecode', 'facevaluerangedescription')
    var comparableFaceValues = super.processFaceValueData(this.comparableDataFVRange, 'ALL', 'facevaluerangecode', 'facevaluerangedescription')
    return super.formatFaceValueData(manufacturerFaceValues, comparableFaceValues)
  }

  loadFaceValueRangeData() {
    this.manufacturerDataFVRange = []
    this.comparableDataFVRange = []

    var manufacturerCode = nch.model.manufacturer.code
    var dataUrl = '/crunch/redemptionsbycode?manufacturer=' + this.getManufactureParam(manufacturerCode)
    dataUrl += '&fv=true'
    this.loadData(dataUrl).then((manufacturerData) => {
      this.manufacturerDataFVRange = manufacturerData
      nch.status.faceValueRangeLoaded = this.manufacturerDataFVRange.length > 0 && this.comparableDataFVRange.length > 0
    })

    dataUrl = '/crunch/redemptionsbycode?manufacturer=' + this.getManufactureParam('ALL')
    dataUrl += '&fv=true'

    this.loadData(dataUrl).then((comparableData) => {
      this.comparableDataFVRange = comparableData
      nch.status.faceValueRangeLoaded = this.manufacturerDataFVRange.length > 0 && this.comparableDataFVRange.length > 0
    })
  }

  getFaceValueDataByMedia(mediaCode) {
    var manufacturerFaceValues = super.processFaceValueDataByMedia(this.manufacturerData, nch.model.manufacturer.code, mediaCode, false)
    var comparableFaceValues = super.processFaceValueDataByMedia(this.comparableData, 'ALL', mediaCode, false)
    return super.formatFaceValueData(manufacturerFaceValues, comparableFaceValues)
  }

  getFaceValueRangeDataByMedia(mediaCode) {
    var manufacturerFaceValues = super.processFaceValueDataByMedia(this.manufacturerDataFVRange, nch.model.manufacturer.code, mediaCode, true)
    var comparableFaceValues = super.processFaceValueDataByMedia(this.comparableDataFVRange, 'ALL', mediaCode, true)
    return super.formatFaceValueData(manufacturerFaceValues, comparableFaceValues)
  }

  getFaceValueDataByCategory(categoryCode) {
    var manufacturerFaceValues = super.processFaceValueDataByCategory(this.manufacturerData, nch.model.manufacturer.code, categoryCode)
    var comparableFaceValues = super.processFaceValueDataByCategory(this.comparableData, 'ALL', categoryCode)
    return super.formatFaceValueData(manufacturerFaceValues, comparableFaceValues)
  }

  // ***** STATE DATA *********************************************************

  getOtherStateData(manufacturerCode, stateAbbrev) {
    var states = manufacturerCode == 'ALL' || manufacturerCode == 'Comparables' ? this.manufacturerStateData : this.comparableStateData;
    return nch.services.filterService.getState(stateAbbrev, states);
  }

  getOtherPaperlessStateData(manufacturerCode, stateAbbrev) {
    var states = manufacturerCode == 'ALL' || manufacturerCode == 'Comparables' ? this.manufacturerPaperlessStateData : this.comparablePaperlessStateData;
    return nch.services.filterService.getState(stateAbbrev, states);
  }

  loadStateByMediaData(manufacturerCode) {
    var dataUrl = '/crunch/redemptionsbystatebymedia?manufacturer=' + this.getManufactureParam(manufacturerCode) + '&detail=true'
    return this.loadDataForCategories(dataUrl)
  }

  // ***** MARKET DATA ********************************************************

  loadMarketData(manufacturerCode, marketType) {
    var dataUrl = nch.utils.getMarketUrl(manufacturerCode, marketType);
    return this.loadDataForCategories(dataUrl)
  }

  loadPaperlessMarketData(manufacturerCode, marketType) {
    var dataUrl = nch.utils.getPaperlessMarketUrl(manufacturerCode, marketType);
    return this.loadData(dataUrl)
  }

  loadMarketDataByMedia(manufacturerCode, marketType) {
    var dataUrl = nch.utils.getMarketByMediaUrl(manufacturerCode, marketType);
    dataUrl += '&detail=true'
    return this.loadDataForCategories(dataUrl)
  }

  // ***** PAPERLESS DATA *****************************************************

  getPaperlessRedemptionData(manufacturerCode) {
    return manufacturerCode === 'ALL' ? this.comparablePaperlessData : this.manufacturerPaperlessData
  }

  getPaperlessFaceValueData() {
    var manufacturerFaceValues = super.processFaceValueData(this.manufacturerPaperlessData, nch.model.manufacturer.code, 'facevaluerangecode', 'facevaluerangedescription')
    var comparableFaceValues = super.processFaceValueData(this.comparablePaperlessData, 'ALL', 'facevaluerangecode', 'facevaluerangedescription')
    return super.formatFaceValueData(manufacturerFaceValues, comparableFaceValues)
  }

  loadPaperless(manufacturerCode) {
    var dataUrl = '/crunch/redemptionspaperless?manufacturer=' + this.getManufactureParam(manufacturerCode)
    return this.loadData(dataUrl)
  }

  // ***** PDF EXPORT DATA ****************************************************

  exportToPdf(svgList, title) {
    const pdfExportUrl = '/crunch/pdf'
    nch.utils.startLoadingService(pdfExportUrl)
    var formData = new FormData()
    formData.append('report', title)
    formData.append('manufacturer', nch.model.manufacturer.code)
    formData.append('year1', nch.model.period1.year)
    formData.append('year2', nch.model.period2.year)

    if (nch.model.selectedTimePeriod === 'quarter') {
      formData.append('q1', nch.model.period1.quarter)
      formData.append('q2', nch.model.period2.quarter)
    }
    else if (nch.model.selectedTimePeriod === 'week') {
      formData.append('w1', nch.model.period1.week)
      formData.append('w2', nch.model.period2.week)
    }
    else if (nch.model.selectedTimePeriod === 'month') {
      formData.append('m1', nch.model.period1.month)
      formData.append('m2', nch.model.period2.month)
    }

    for (let i = 0; i < svgList.length; i++) {
      var svgData = svgList[i]
      formData.append('svg', svgData.ele)
    }

    var segmentName = nch.model.selectedSegmentCode === 1 ? 'Food' : 'Non-Food'
    formData.append('segment', segmentName)

    // selected sector had been removed, pull this from the first selected category
    if (nch.model.selectedCategories.length > 0) {
      var category = nch.model.selectedCategories[0]
      formData.append('sector', category.sectorname)
    }

    http.post(pdfExportUrl)
      .send(formData)
      .end(function (error, response) {
        nch.utils.endLoadingService(pdfExportUrl)

        if (response.status === 200) {
          var pdfAsDataUri = "data:application/pdf;base64," + response.text;
          window.open(pdfAsDataUri);
        }
      })
  }

  // ***** PRIVATE METHODS ****************************************************

  loadProductMovedData(manufacturerCode) {
    var dataUrl = '/crunch/redemptionsbyproductmoved?manufacturer=' + this.getManufactureParam(manufacturerCode)
    return this.loadData(dataUrl)
  }

  loadRedemptionData(manufacturerCode) {
    var dataUrl = '/crunch/redemptionsbycode?manufacturer=' + this.getManufactureParam(manufacturerCode)
    return this.loadData(dataUrl)
  }

  loadStateData(manufacturerCode) {
    var dataUrl = '/crunch/redemptionsbystate?manufacturer=' + this.getManufactureParam(manufacturerCode)
    var promise = this.loadDataForCategories(dataUrl)

    promise.then((response) => {
      if (manufacturerCode === 'ALL') {
        this.comparableStateData = response
      }
      else {
        this.manufacturerStateData = response
      }
    })

    return promise;
  }

  loadPaperlessStateData(manufacturerCode) {
    var dataUrl = '/crunch/redemptionspaperlessbystate?manufacturer=' + this.getManufactureParam(manufacturerCode)
    var promise = this.loadData(dataUrl)

    promise.then((response) => {
      if (manufacturerCode === 'ALL') {
        this.comparablePaperlessStateData = response
      }
      else {
        this.manufacturerPaperlessStateData = response
      }
    })
    return promise
  }

  loadDataForCategories(dataUrl) {
    dataUrl = nch.utils.appendCategories(dataUrl)
    return this.loadData(dataUrl)
  }

  loadData(dataUrl) {
    dataUrl = nch.utils.appendFilters(dataUrl)
    nch.utils.startLoadingService(dataUrl)
    return new Promise((resolve, reject) => {
      http
        .get(dataUrl)
        .end(function (error, response) {
          nch.utils.endLoadingService(dataUrl)
          if (response.status === 200) {
            const json = JSON.parse(response.text)
            resolve(json)
          } else if (response.status === 401 || response.status === 403) {
            console.log('user not authorized')
            reject(error)
            nch.eventDispatcher.$emit('unauthorizedRequest');
          } else if (response.status > 499) {
            console.log('Server Error')
            reject(error)
          } else if (response.status === 404) {
            console.log('Resource not found')
            reject(error)
          }
        })
    })
  }

  getManufactureParam(manufacturerCode) {
    if (manufacturerCode === 'ALL' || manufacturerCode === 'Comparables') {
      manufacturerCode = '~' + nch.model.manufacturer.code
    }

    return manufacturerCode;
  }
}
