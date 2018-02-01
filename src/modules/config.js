let nch = {
  services: {
    dataService: null,
    filterService: null,
    timePeriodService: null,
    sectorCategoryService: null,
    cacheService: null
  },
  status: {
    productMovedLoaded: false,
    redemptionsLoaded: false,
    faceValueRangeLoaded: false,
    paperlessRedemptionsLoaded: false
  },
  model: {
    title: 'NCH',
    categories: [],
    allMediaTypeData: [],
    selectedCategories: [],
    loadingServices: [],
    showAlert: false,
    showTerms: false,
    terms: '',
    readTerms: true,
    alertMessage: [],
    mediaTypes: null,
    mediaTypeNames: ["FSI", "Handout Electronic Checkout", "Print At Home", "Military", "Other Paper"],
    manufacturer: {
      code: -1,
      name: ''
    },
    loginData: null,
    loggingin: false,
    colors: {
      piecolors: [],
      barcolors: [],
      stackedbarcolors: [],
      bipartitecolors: {},
      geocolors: []
    },
    manufacturerData: null,
    comparableData: null,
    productMovedData: null,
    selectedItem: {
      year: {},
      quarter: {},
      month: {},
      week: {}
    },
    weekData: [],
    sidebarItems: [],
    helpItems: [],
    notifications: [],
    foodSegmentCode: 1,
    nonFoodSegmentCode: 2,
    selectedSegmentCode: 1,
    selectedSector: null,
    period1: null,
    period2: null,
    classOfTrades: [],
    sectors: [],
    currentUser: null,
    selectedTimePeriod: 'quarter',
    timePeriods: [
      //{ id: 'year', label: 'Year over year' },
      { id: 'quarter', label: 'Quarter over quarter' },
      { id: 'month', label: 'Month over month' },
      { id: 'week', label: 'Week over week' }
    ]
  }
}
module.exports = nch

