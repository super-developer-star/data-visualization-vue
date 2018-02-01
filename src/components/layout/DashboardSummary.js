import FilterModal from 'src/components/modals/FilterModal'
import TimePeriod from '../layout/TimePeriod'

export default {
  name: 'dashboard-summary',
  template: require('components/layout/DashboardSummary.html'),
  components: {
    FilterModal,
    TimePeriod
  },
  props: {
    callback: Function
  },
  data() {
    return {
      model: nch.model,
      service: nch.services,
      timePeriodChanged: false,
      showCategoriesModal: false,
      nonFoodSegment: null,
      selectedSector: null,
      selectedTimePeriod: null,
      segmentNames: [
        'Non-Food',
        'Food'
      ]
    }
  },
  watch: {
    selectedTimePeriod: function (val) {
      this.model.selectedTimePeriod = val
    },
    'model.selectedSegmentCode': function(value) {
      this.service.cacheService.setCacheSegment()
      this.nonFoodSegment = value === 2
    }
  },
  computed: {
    currentView() {
      return this.$router.currentRoute.name
    },
    segmentName() {
      return this.nonFoodSegment ? this.segmentNames[0] : this.segmentNames[1]
    },
    sectorName() {
      return (this.model.selectedSector === null || this.model.selectedSector === undefined) ? '' : this.model.selectedSector.sectorname
    }

  },
  mounted() {
    let component = this
    nch.eventDispatcher.$on('sectorCategoryDataLoaded', () => {
      component.selectedSector = component.model.sectors[0]
      component.nonFoodSegment = component.model.selectedSegmentCode === 2
      nch.eventDispatcher.$emit('refreshdata');
    })

    nch.eventDispatcher.$on('timePeriodSelectorClosed', function () {
      component.timePeriodChanged = false;
    })
    this.nonFoodSegment = this.model.selectedSegmentCode === 2
    this.selectedSector = this.model.selectedSector
    this.model.selectedTimePeriod = this.service.cacheService.getCacheTimeperiod() ? this.service.cacheService.getCacheTimeperiod().selectedTimePeriod : this.model.selectedTimePeriod
    this.selectedTimePeriod = this.model.selectedTimePeriod
    this.updateTimePeriod()
  },
  methods: {
    updateSector: function () {
      if (this.model.sectors && this.model.sectors.length > 0 && !this.selectedSector) {
        this.selectedSector = this.model.sectors[0]
      }
    },
    updateCategory: function () {
      if( this.selectedSector == null ) {
        return
      }

      this.model.selectedSector = this.selectedSector
      this.model.selectedCategories = this.model.categories = this.service.sectorCategoryService.getCategories(this.selectedSector)
      nch.eventDispatcher.$emit('refreshdata');
    },
    updateTimePeriodType: function(e) {
      this.selectedTimePeriod = this.model.selectedTimePeriod = e.target.value
      this.timePeriodChanged = true;

      if( this.selectedTimePeriod === 'ytd' ) {
        var latestYear = nch.services.timePeriodService.getLatestYear()
        nch.model.period1 = nch.services.timePeriodService.findYearObject( latestYear.year - 1 )
        nch.model.period2 = latestYear
      }
    },
    updateTimePeriod: function () {
      if (this.model.timePeriods && this.model.timePeriods.length > 0 && !this.selectedTimePeriod) {
        this.selectedTimePeriod = this.model.timePeriods[0].id
      } else {
        this.selectedTimePeriod = this.model.selectedTimePeriod
      }
    },
    updateSegment: function () {
      this.model.selectedSegmentCode = this.nonFoodSegment ? nch.model.nonFoodSegmentCode : nch.model.foodSegmentCode
      this.model.sectors = this.service.sectorCategoryService.getSectors(this.model.selectedSegmentCode)
      this.model.selectedSector = this.selectedSector = this.model.sectors[0]
      this.model.selectedCategories = this.model.categories = this.service.sectorCategoryService.getCategories(this.selectedSector)
      this.service.cacheService.setCacheSectorsCategories()
    },
    hideModal: function () {
      this.showCategoriesModal = false
    },
    saveModal: function (updatedCategories, selectedSector) {
      this.model.selectedCategories = updatedCategories
      this.model.selectedSector = selectedSector

      if (this.model.selectedCategories.length > 0) {
        var category = this.model.selectedCategories[0]
        this.nonFoodSegment = category.segmentcode === nch.model.nonFoodSegmentCode
      }

      this.showCategoriesModal = false
      this.service.cacheService.setCacheSectorsCategories()
      nch.eventDispatcher.$emit('categoriesUpdated')
    }
  }
}
