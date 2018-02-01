import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Pie from '../charts/Pie'
import Bar from '../charts/Bar'
import DynamicTable from '../tables/DynamicTable'
import PageFooter from '../layout/PageFooter'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'
import vSelect from 'vue-select'
import Multiselect from 'vue-multiselect'
import Loader from '../layout/Loader'

export default {
  name: 'home',
  template: require('components/views/Dashboard.html'),
  components: {
    Navbar,
    Sidebar,
    Pie,
    Bar,
    DynamicTable,
    DashboardSummary,
    Download,
    ViewHeader,
    PageFooter,
    vSelect,
    Multiselect,
    Loader
  },
  data() {
	//nch.model.breadcrumbTitle = "\uF080 Redemption Index to Prior Period: "
    nch.model.breadcrumbTitle = "Redemption Index to Prior Period"
    return {
      model: nch.model,
      service: nch.services,
      showDownloadOptions: false,
      productMovedFilter: {
        manufacturerCode: null,
        period: null,
        offerCode: null
      },
      multiSelectData: []
    }
  },
  watch: {
    'model.selectedCategories': {
      handler: function (newValue, oldValue) {
        nch.eventDispatcher.$emit('categoriesUpdated')
        this.service.cacheService.setCacheSectorsCategories()
      },
      deep: true
    },
    'model.loadingData': {
      handler: function (newValue, oldValue) {

      },
      deep: true
    }
  },
  mounted() {
    console.log('----- Dashboard mounted -----')
    let component = this
    nch.eventDispatcher.$on('sectorCategoryDataLoaded', function () {
      component.loadMultiSelectData()
    })

    this.selectedSector = this.model.selectedSector
  },
  destroyed() {
    console.log('***** Dashboard destroyed *****')
  },
  methods: {
    loadMultiSelectData() {
      var sectors = nch.model.sectors
      let component = this
      component.multiSelectData = sectors.map(function(sector) {
        return {
          sectorname: sector.sectorname,
          categories: component.service.sectorCategoryService.getCategories(sector)
        }
      })
    }
  }
}
