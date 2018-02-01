import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'
import Loader from '../layout/Loader'
import Pie from '../charts/Pie'
import Geo from '../charts/Geo'
import NielsenMarket from '../charts/NielsenMarket'
import StackedBar from '../charts/StackedBar'

export default {
  name: 'Paperless',
  template: require('components/views/Paperless.html'),
  props: ['view'],
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    PageFooter,
    Download,
    ViewHeader,
    Loader,
    Pie,
    Geo,
    NielsenMarket,
    StackedBar
  },
  watch: {
    'view': {
      handler: function (newValue, oldValue) {
        this.lock.active = false // don't allow lock to persist view changes
      }
    }
  },
  computed: {
    marketLabel() {
      return nch.utils.getMarketLabel( this.view )
    },
    manufacturerGeoId() {
      return 'paperlessMarketChart_' + this.view + '_manufacturer'
    },
    comparableGeoId() {
      return 'paperlessMarketChart_' + this.view + '_ALL'
    }
  },
  data () {
    return {
      model: nch.model,
      lock: {
        active: false
      },
      facevalueFilter: {
        category: null,
        period: null,
        faceValueCode: null
      }
    }
  },
  methods: {
    onUnlock() {
      this.lock.active = false
    }
  }
}
