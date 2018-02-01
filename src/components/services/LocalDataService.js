import services from '../../modules/services'
import DataService from './DataService'

export default class LocalDataService extends DataService {

  constructor () {
    super()
    this.manufacturerData = []
    this.comparableData = []
    this.manufacturerPaperlessData = []
    this.comparablePaperlessData = []
    this.comparableProductMovedData = []
    this.manufacturerProductMovedData = []
    this.comparableMarketData = []
    this.manufacturerMarketData = []
    this.comparableMarketMediaData = []
    this.manufacturerMarketMediaData = []
    this.manufacturerStateData = null
    this.comparableStateData = null
    this.manufacturerPaperlessStateData = null;
    this.comparablePaperlessStateData = null;

    services.loadManufacturerData().then((response) => {
      this.manufacturerData = response
      nch.model.manufacturerData = response
      console.log('Manufacturer data loaded, total records: ' + this.manufacturerData.length)
      nch.status.redemptionsLoaded = this.manufacturerData.length > 0 &&  this.comparableData.length > 0
      nch.eventDispatcher.$emit('dataLoaded')
    }).catch((message) => { console.log('LocalDataService, loadManufacturerData promise catch:' + message) })

    services.loadComparableData().then((response) => {
      this.comparableData = response
      nch.model.comparableData = response
      console.log('Comparable data loaded, total records: ' + this.comparableData.length)
      nch.status.redemptionsLoaded = this.manufacturerData.length > 0 &&  this.comparableData.length > 0
      nch.eventDispatcher.$emit('dataLoaded')
    }).catch((message) => { console.log('LocalDataService, loadComparableData promise catch:' + message) })

    services.loadProductMovedManufacturerData().then((response) => {
      this.manufacturerProductMovedData = response
      nch.status.productMovedLoaded = this.manufacturerProductMovedData.length > 0 &&  this.comparableProductMovedData.length > 0
      console.log('Product moved data manufacturer loaded, total records: ' + this.manufacturerProductMovedData.length)
    }).catch((message) => { console.log('LocalDataService, getProductMovedPieData promise catch:' + message) })

    services.loadProductMovedComparableData().then((response) => {
      this.comparableProductMovedData = response
      nch.status.productMovedLoaded = this.manufacturerProductMovedData.length > 0 &&  this.comparableProductMovedData.length > 0
      console.log('Product moved comparable data loaded, total records: ' + this.comparableProductMovedData.length)
    }).catch((message) => { console.log('LocalDataService, getProductMovedPieData promise catch:' + message) })

    services.loadManufacturerMarketData().then((response) => {
      this.manufacturerMarketData = response
      console.log('Market data manufacturer loaded, total records: ' + this.manufacturerMarketData.length)
      nch.eventDispatcher.$emit('marketDataLoaded')
    }).catch((message) => { console.log('LocalDataService, manufacturer market promise catch:' + message) })

    services.loadComparableMarketData().then((response) => {
      this.comparableMarketData = response
      console.log('Market comparable data loaded, total records: ' + this.comparableMarketData.length)
      nch.eventDispatcher.$emit('marketDataLoaded')
    }).catch((message) => { console.log('LocalDataService, comparable market promise catch:' + message) })

    services.loadManufacturerMarketMediaData().then((response) => {
      this.manufacturerMarketMediaData = response
      console.log('Market Media data manufacturer loaded, total records: ' + this.manufacturerMarketMediaData.length)
      nch.eventDispatcher.$emit('marketMediaDataLoaded')
    }).catch((message) => { console.log('LocalDataService, manufacturer media market promise catch:' + message) })

    services.loadComparableMarketMediaData().then((response) => {
      this.comparableMarketMediaData = response
      console.log('Market Media comparable data loaded, total records: ' + this.comparableMarketMediaData.length)
      nch.eventDispatcher.$emit('marketMediaDataLoaded')
    }).catch((message) => { console.log('LocalDataService, comparable media market promise catch:' + message) })

    services.loadPaperlessManufacturerData().then((response) => {
      this.manufacturerPaperlessData = response
      console.log('Paperless manufacturer data loaded, total records: ' + this.manufacturerPaperlessData.length)
    }).catch((message) => { console.log('LocalDataService, loadPaperlessManufacturerData promise catch:' + message) })

    services.loadPaperlessComparableData().then((response) => {
      this.comparablePaperlessData = response
      console.log('Paperless comparable data loaded, total records: ' + this.comparablePaperlessData.length)
    }).catch((message) => { console.log('LocalDataService, loadPaperlessComparableData promise catch:' + message) })
  }

  getType () {
    return 'local data service'
  }

  // ***** MEDIA TYPE DATA ****************************************************

  getRedemptionsByMedia (manufacturerCode) {
    return manufacturerCode == 'ALL' ? super.processRedemptionsByMedia(this.comparableData) : super.processRedemptionsByMedia(this.manufacturerData)
  }

  getRedemptionsByMediaForCategory (manufacturerCode, categoryCode) {
    return manufacturerCode == 'ALL' ? super.processRedemptionsByMediaForCategory(this.comparableData, categoryCode) : super.processRedemptionsByMediaForCategory(this.manufacturerData, categoryCode)
  }

  // ***** CLASS OF TRADES ****************************************************

  getRedemptionsByClassOfTrade (manufacturerCode) {
    return manufacturerCode == 'ALL' ? super.processRedemptionsByClassOfTrade(this.comparableData) : super.processRedemptionsByClassOfTrade(this.manufacturerData)
  }

  getRedemptionsByClassOfTradeForCategory (manufacturerCode, categoryCode) {
    return manufacturerCode == 'ALL' ? super.processRedemptionsByClassOfTradeForCategory(this.comparableData, categoryCode) : super.processRedemptionsByClassOfTradeForCategory(this.manufacturerData, categoryCode)
  }

  // ***** FACE VALUE DATA ****************************************************

  getFaceValueData () {
    var manufacturerFaceValues = super.processFaceValueData(this.manufacturerData, nch.model.manufacturer.code, 'facevalueperunitrangecode', 'facevalueperunitrangedescription')
    var comparableFaceValues = super.processFaceValueData(this.comparableData, 'ALL', 'facevalueperunitrangecode', 'facevalueperunitrangedescription')
    return super.formatFaceValueData(manufacturerFaceValues, comparableFaceValues)
  }

  getFaceValueRangeData () {
    return this.getFaceValueData()
  }

  getFaceValueDataByMedia (mediaCode) {
    var manufacturerFaceValues = super.processFaceValueDataByMedia(this.manufacturerData, nch.model.manufacturer.code, mediaCode, false)
    var comparableFaceValues = super.processFaceValueDataByMedia(this.comparableData, 'ALL', mediaCode, false)
    return super.formatFaceValueData(manufacturerFaceValues, comparableFaceValues)
  }

  getFaceValueRangeDataByMedia(mediaCode) {
    return this.getFaceValueDataByMedia(mediaCode)
  }

  getFaceValueDataByCategory(categoryCode) {
    var manufacturerFaceValues = super.processFaceValueDataByCategory(this.manufacturerData, nch.model.manufacturer.code, categoryCode)
    var comparableFaceValues = super.processFaceValueDataByCategory(this.comparableData, 'ALL', categoryCode)
    return super.formatFaceValueData(manufacturerFaceValues, comparableFaceValues)
  }

  // ***** PDF EXPORT DATA ****************************************************

  exportToPdf ( svg, title ) {
    services.exportToPdf( svg, title )
  }

  // ***** PAPERLESS DATA *****************************************************

  getPaperlessFaceValueData () {
    var manufacturerFaceValues = super.processFaceValueData(this.manufacturerPaperlessData, nch.model.manufacturer.code, 'facevaluerangecode', 'facevaluerangedescription')
    var comparableFaceValues = super.processFaceValueData(this.comparablePaperlessData, 'ALL', 'facevaluerangecode', 'facevaluerangedescription')
    return super.formatFaceValueData(manufacturerFaceValues, comparableFaceValues)
  }

  getRedemptionData (manufacturerCode) {
    return manufacturerCode === 'ALL' ? this.comparableData : this.manufacturerData
  }

  getRedemptionDataWithFVRange(manufacturerCode) {
    return this.getRedemptionData( manufacturerCode )
  }

  getPaperlessRedemptionData (manufacturerCode) {
    return manufacturerCode === 'ALL' ? this.comparablePaperlessData : this.manufacturerPaperlessData
  }

  getOtherStateData (manufacturerCode, stateAbbrev) {
    var states = manufacturerCode === 'ALL' || manufacturerCode === 'Comparables' ? this.manufacturerStateData : this.comparableStateData
    return nch.services.filterService.getState(stateAbbrev, states)
  }

  getOtherPaperlessStateData(manufacturerCode, stateAbbrev) {
    var states = manufacturerCode == 'ALL' || manufacturerCode == 'Comparables' ? this.manufacturerPaperlessStateData : this.comparablePaperlessStateData;
    return nch.services.filterService.getState(stateAbbrev, states);
  }

  loadStateData (manufacturerCode) {
    var promise = null

    if (manufacturerCode == 'ALL' || manufacturerCode == 'Comparables') {
      promise = services.loadStateRedemptionsAllData()
      promise.then( (response) => { this.comparableStateData = response })
    }
    else {
      promise = services.loadStateRedemptionsManufacturerData()
      promise.then( (response) => { this.manufacturerStateData = response })
    }

    return promise
  }

  loadPaperlessStateData (manufacturerCode) {
    var promise = services.loadPaperlessGeo( 'state' )

    promise.then( (response) => {
      if( manufacturerCode === 'ALL' ) {
        this.comparablePaperlessStateData = response
      }
      else {
        this.manufacturerPaperlessStateData = response
      }
    })

    return promise
  }

  loadStateByMediaData (manufacturerCode) {
    if (manufacturerCode == 'ALL' || manufacturerCode == 'Comparables') {
      return services.loadBipartiteComparableData()
    }
    else {
      return services.loadBipartiteManufacturerData()
    }
  }

  getProductMovedForManufacturerData (manufacturerCode) {
    return manufacturerCode == 'ALL' ? this.comparableProductMovedData : this.manufacturerProductMovedData
  }

  loadMarketData (manufacturerCode, marketType) {
    return services.loadMarketData(manufacturerCode, marketType)
  }

  loadPaperlessMarketData (manufacturerCode, marketType) {
    return services.loadPaperlessGeo( marketType )
  }

  /**
   * TODO: review this... may need a new example data set here
   * @param manufacturerCode
   * @param marketType
   * @returns {Promise}
   */
  loadMarketDataByMedia (manufacturerCode, marketType) {
    return services.loadMarketDataByMedia(manufacturerCode, marketType)
  }
}
