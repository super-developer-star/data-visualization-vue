import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'
import Download from '../layout/Download'
import Loader from '../layout/Loader'
import Pie from '../charts/Pie'
import Bar from '../charts/Bar'

import {mixin as clickaway} from 'vue-clickaway';

export default {
  name: 'classoftrade',
  mixins: [clickaway],
  template: require('components/views/ClassOfTrade.html'),
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    PageFooter,
    ViewHeader,
    Download,
    Loader,
    Pie,
    Bar,
  },
  data () {
    nch.model.breadcrumbTitle = "Redemption Share by Class of Trade"
    return {
      model: nch.model,
      showDownloadOptions: false,
      lock: {
        active: false
      },
      mediaFilter: {
        category: null,
        classOfTradeCode: null,
        period: null
      }
    }
  },
  methods: {
    away: function () {
      this.showDownloadOptions = false
    },

    onUnlock() {
      this.lock.active = false
    }
  }
}
