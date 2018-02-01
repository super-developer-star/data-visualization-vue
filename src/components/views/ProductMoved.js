import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'
import PageFooter from '../layout/PageFooter'
import Pie from '../charts/Pie'
import Bar from '../charts/Bar'
import Loader from '../layout/Loader'

export default {
  name: 'productmoved',
  template: require('components/views/ProductMoved.html'),
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    Pie,
    Bar,
    ViewHeader,
    PageFooter,
    Download,
    Loader
  },
  data () {
	//nch.model.breadcrumbTitle = "\uF200 Products Moved: "
    nch.model.breadcrumbTitle = "Products Moved"
    return {
      model: nch.model,
      lock: {
        active: false
      },
      productMovedFilter: {
        manufacturerCode: null,
        period: null,
        offerCode: null
      }
    }
  },
  methods: {
    onUnlock() {
      this.lock.active = false
    }
  }
}
