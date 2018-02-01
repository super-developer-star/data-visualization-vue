export default class CacheService {
  constructor () {
    this.cacheTimePeriod = {
      selectedTimePeriod: null,
      period1: {},
      period2: {},
      selectedItem: {}
    }

    this.cacheSegment = {
      selectedSegmentCode: null
    }

    this.cacheSectorsCategories = {
      sectors: null,
      selectedSector: null,
      selectedCategories: null
    }

    this.cacheTimePeriod = JSON.parse(localStorage.getItem('cacheTimePeriod') || 'null')
    this.cacheSegment = JSON.parse(localStorage.getItem('cacheSegment') || 'null')
    this.cacheSectorsCategories = JSON.parse(localStorage.getItem('cacheSectorsCategories') || 'null')

    if (this.cacheTimePeriod) {
      nch.model.selectedItem = this.cacheTimePeriod.selectedItem
      nch.model.period1 = this.cacheTimePeriod.period1
      nch.model.period2 = this.cacheTimePeriod.period2
      nch.model.selectedTimePeriod = this.cacheTimePeriod.selectedTimePeriod
    }
  }

  clearCache () {
    localStorage.removeItem('cacheTimePeriod')
    localStorage.removeItem('cacheSegment')
    localStorage.removeItem('cacheSectorsCategories')
  }

  getCacheTimeperiod () {
    return this.cacheTimePeriod
  }

  getCacheSegment () {
    return this.cacheSegment
  }

  getCacheSectorsCategories () {
    return this.cacheSectorsCategories
  }

  setCacheTimeperiod () {
    localStorage.setItem('cacheTimePeriod', JSON.stringify({
      selectedTimePeriod: nch.model.selectedTimePeriod,
      period1: nch.model.period1,
      period2: nch.model.period2,
      selectedItem: nch.model.selectedItem
    }))
    this.cacheTimePeriod = JSON.parse(localStorage.getItem('cacheTimePeriod') || 'null')
  }

  setCacheSegment () {
    localStorage.setItem('cacheSegment', JSON.stringify({
      selectedSegmentCode: nch.model.selectedSegmentCode
    }))
  }

  setCacheSectorsCategories () {
    localStorage.setItem('cacheSectorsCategories', JSON.stringify({
      sectors: nch.model.sectors,
      selectedSector: nch.model.selectedSector,
      selectedCategories: nch.model.selectedCategories
    }))
  }
}
