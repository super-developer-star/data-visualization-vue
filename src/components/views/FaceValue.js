import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'
import Download from '../layout/Download'
import Pie from '../charts/Pie'
import StackedBar from '../charts/StackedBar'
import Loader from '../layout/Loader'

export default {
  name: 'facevalue',
  template: require('components/views/FaceValue.html'),
  props: ['view'],
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    PageFooter,
    ViewHeader,
    Download,
    Pie,
    StackedBar,
    Loader
  },
  watch: {
    'view': {
      handler: function (newValue, oldValue) {
        this.lock.active = false // don't allow lock to persist view changes
      }
    }
  },
  data() {
    nch.model.breadcrumbTitle = "Face Value Redeemed"
    return {
      model: nch.model,
      showDownloadOptions: false,
      lock: {
        active: false
      },
      facevalueFilter: {
        manufacturerCode: null,
        mediaCode: null,
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
