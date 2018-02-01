import services from '../../modules/services'

export default class SectorCategoryService {

  constructor() {
    this.hasFood = false
    this.sectors = []
    this.categories = []
    this.init()
  }

  init() {
    var promise = null;
    if (process.env.NODE_ENV === 'development') {
      promise = services.loadSectorsData()
    } else {
      promise = services.loadRemoteSectorsData()
    }
    promise.then((response) => {
      this.sectors = this.filterSectors(response)

      nch.model.selectedSegmentCode = nch.services.cacheService.getCacheSegment() ? nch.services.cacheService.getCacheSegment().selectedSegmentCode : nch.model.selectedSegmentCode

      if( !this.hasFood ) {
        nch.model.selectedSegmentCode = 2 // if there aren't any food categories, for segment to Non-food
        nch.services.cacheService.setCacheSegment()
      }

      var cachedSectorCategories = nch.services.cacheService.getCacheSectorsCategories()
      nch.model.sectors = cachedSectorCategories ? cachedSectorCategories.sectors : this.getSectors(nch.model.selectedSegmentCode)

      this.categories = response
      nch.model.categories = response

      // initialize selections
      nch.model.selectedSector = cachedSectorCategories ? cachedSectorCategories.selectedSector : this.getSectors(nch.model.selectedSegmentCode)[0]
      nch.model.selectedCategories = cachedSectorCategories ? cachedSectorCategories.selectedCategories : this.getCategories( nch.model.selectedSector )

      console.log('Sector data loaded, total records: ' + this.sectors.length)
      console.log('Sector Categories data loaded, total records: ' + this.categories.length)
      nch.eventDispatcher.$emit('sectorCategoryDataLoaded')

    }).catch((message) => {
      console.log('SectorCategoryService, loadSectorsData promise catch:' + message)
      nch.model.alertMessage.push( 'Unable to load Categories' )
      nch.model.showAlert = true
    })
  }

  getSectors(segmentId) {
    let selectedSectors = []
    for (let i = 0; i < this.sectors.length; i++) {
      if (this.sectors[i].segmentcode === segmentId) {
        selectedSectors.push(this.sectors[i])
      }
    }
    this.sortObject(selectedSectors, 'sectorname')
    return selectedSectors
  }

  getCategories(sector = null) {
    let selectedCategories = []
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].sectorcode === sector.sectorcode) {
        selectedCategories.push(this.categories[i])
      }
    }
    this.sortObject(selectedCategories, 'categoryname')
    return selectedCategories
  }

  sortObject(list, keyword) {
    list.sort(function(a, b) {
      if (a[keyword] < b[keyword]) return -1
      if (a[keyword] > b[keyword]) return 1
      return 0
    })
  }

  filterSectors( sectorList ) {
    this.hasFood = false
    var groupedData = {};

    for( var i = 0; i < sectorList.length; i++ ) {
      var item = sectorList[i];

      if( item.segmentcode === 1 ) {
        this.hasFood = true
      }

      var currentData = null;
      var code = item.sectorcode;

      if( groupedData[ code ] === undefined ) {
        currentData = { sectorcode: code, sectorname: item.sectorname, segmentcode: item.segmentcode }
        groupedData[ code ] = currentData
      }
    }

    var list = [];
    var dataIds = Object.keys( groupedData );

    for( var j = 0; j < dataIds.length; j++ ) {
      var dataId = dataIds[j];
      list.push( groupedData[dataId] );
    }

    return list;
  }
}
