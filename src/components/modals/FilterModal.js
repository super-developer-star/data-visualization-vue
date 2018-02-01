import Loader from '../layout/Loader'
import FilterSector from './FilterSector'

export default {
  name: 'filter-modal',
  template: require('components/modals/FilterModal.html'),
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: false
    },
    categories: {
      type: Array,
      default: []
    },
    sectors: {
      type: Array,
      default: []
    },
    onClose: Function,
    onSave: Function
  },
  components: {
    Loader,
    FilterSector
  },
  data() {
    return {
      selectedSector: nch.model.selectedSector,
      comparisonvalue: nch.model.selectedCategories,
      service: nch.services.sectorCategoryService,
      isLoading: false
    }
  },
  watch: {
    show: function(val) {
      if (val) {
        nch.eventDispatcher.$emit('selectCategories', nch.model.selectedCategories)
        this.comparisonvalue = nch.model.selectedCategories
      }
    }
  },
  mounted() {
    const that = this
    nch.eventDispatcher.$on('updateCategories', function(val, sector) {
      that.comparisonvalue = val
      that.selectedSector = sector
    })
  },
  methods: {
    ok() {
      let self = this
      this.onSave(self.comparisonvalue, self.selectedSector)
      this.onClose()
    },
    cancel() {
      this.onClose()
    },
    getCategories: function(sector) {
      return this.service.getCategories(sector)
    }
  }
}
