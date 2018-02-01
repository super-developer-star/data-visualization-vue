import * as http from 'superagent'

export default class MarketDataService {
  constructor() {
    this.resetData()
    this.initListeners()

    this.comparableNielsenMediaData = []
    this.manufacturerNielsenMediaData = []
    this.comparableDMAMediaData = []
    this.manufacturerDMAMediaData = []
    this.comparableIRIMediaData = []
    this.manufacturerIRIMediaData = []

    this.paperlessComparableNielsenData = []
    this.paperlessManufacturerNielsenData = []
    this.paperlessComparableDMAData = []
    this.paperlessManufacturerDMAData = []
    this.paperlessComparableIRIData = []
    this.paperlessManufacturerIRIData = []
  }

  getType() {
    return 'market data service'
  }

  initListeners() {

    nch.eventDispatcher.$on('categoriesUpdated', () => {
      console.log( 'Categories changed, updating data')
      this.resetData()
    })

    nch.eventDispatcher.$on('refreshdata', () => {
      console.log( 'Categories or time period changed, updating data')
      this.resetData()
    })
  }

  resetData() {
    // geo chart data
    this.comparableNielsenData = []
    this.manufacturerNielsenData = []
    this.comparableDMAData = []
    this.manufacturerDMAData = []
    this.comparableIRIData = []
    this.manufacturerIRIData = []
  }

  getGeoData( manufacturer, marketType ) {
    if( manufacturer === 'ALL' || manufacturer === 'Comparables' ) {
      if( marketType === 'iri' ) {
        return this.comparableIRIData
      }
      else if( marketType === 'dma' ) {
        return this.comparableDMAData
      }
      else {
        return this.comparableNielsenData
      }
    }
    else {
      if( marketType === 'iri' ) {
        return this.manufacturerIRIData
      }
      else if( marketType === 'dma' ) {
        return this.manufacturerDMAData
      }
      else {
        return this.manufacturerNielsenData
      }
    }
  }

  setGeoData( manufacturer, marketType, list ) {
    if( manufacturer === 'ALL' || manufacturer === 'Comparables' ) {
      if( marketType === 'iri' ) {
        this.comparableIRIData = list
      }
      else if( marketType === 'dma' ) {
        this.comparableDMAData = list
      }
      else {
        this.comparableNielsenData = list
      }
    }
    else {
      if( marketType === 'iri' ) {
        this.manufacturerIRIData = list
      }
      else if( marketType === 'dma' ) {
        this.manufacturerDMAData = list
      }
      else {
        this.manufacturerNielsenData = list
      }
    }
  }

  getGeoMediaData( manufacturer, marketType ) {
    if( manufacturer === 'ALL' || manufacturer === 'Comparables' ) {
      if( marketType === 'iri' ) {
        return this.comparableIRIMediaData
      }
      else if( marketType === 'dma' ) {
        return this.comparableDMAMediaData
      }
      else {
        return this.comparableNielsenMediaData
      }
    }
    else {
      if( marketType === 'iri' ) {
        return this.manufacturerIRIMediaData
      }
      else if( marketType === 'dma' ) {
        return this.manufacturerDMAMediaData
      }
      else {
        return this.manufacturerNielsenMediaData
      }
    }
  }

  resetGeoMediaData( manufacturer, marketType ) {
    if( manufacturer === 'ALL' || manufacturer === 'Comparables' ) {
      if( marketType === 'iri' ) {
        this.comparableIRIMediaData = []
      }
      else if( marketType === 'dma' ) {
        this.comparableDMAMediaData = []
      }
      else {
        this.comparableNielsenMediaData = []
      }
    }
    else {
      if( marketType === 'iri' ) {
        this.manufacturerIRIMediaData = []
      }
      else if( marketType === 'dma' ) {
        this.manufacturerDMAMediaData = []
      }
      else {
        this.manufacturerNielsenMediaData = []
      }
    }
  }

  setGeoMediaData( manufacturer, marketType, list ) {
    if( manufacturer === 'ALL' || manufacturer === 'Comparables' ) {
      if( marketType === 'iri' ) {
        this.comparableIRIMediaData = list
      }
      else if( marketType === 'dma' ) {
        this.comparableDMAMediaData = list
      }
      else {
        this.comparableNielsenMediaData = list
      }
    }
    else {
      if( marketType === 'iri' ) {
        this.manufacturerIRIMediaData = list
      }
      else if( marketType === 'dma' ) {
        this.manufacturerDMAMediaData = list
      }
      else {
        this.manufacturerNielsenMediaData = list
      }
    }
  }


  getPaperlessGeoData( manufacturer, marketType ) {
    if( manufacturer === 'ALL' || manufacturer === 'Comparables' ) {
      if( marketType === 'iri' ) {
        return this.paperlessComparableIRIData
      }
      else if( marketType === 'dma' ) {
        return this.paperlessComparableDMAData
      }
      else {
        return this.paperlessComparableNielsenData
      }
    }
    else {
      if( marketType === 'iri' ) {
        return this.paperlessManufacturerIRIData
      }
      else if( marketType === 'dma' ) {
        return this.paperlessManufacturerDMAData
      }
      else {
        return this.paperlessManufacturerNielsenData
      }
    }
  }

  setPaperlessGeoData( manufacturer, marketType, list ) {
    if( manufacturer === 'ALL' || manufacturer === 'Comparables' ) {
      if( marketType === 'iri' ) {
        this.paperlessComparableIRIData = list
      }
      else if( marketType === 'dma' ) {
        this.paperlessComparableDMAData = list
      }
      else {
        this.paperlessComparableNielsenData = list
      }
    }
    else {
      if( marketType === 'iri' ) {
        this.paperlessManufacturerIRIData = list
      }
      else if( marketType === 'dma' ) {
        this.paperlessManufacturerDMAData = list
      }
      else {
        this.paperlessManufacturerNielsenData = list
      }
    }
  }
}
