import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Bipartite from '../charts/Bipartite'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import Loader from '../layout/Loader'

export default {
  name: 'home',
  template: require('components/views/BilateralData.html'),
  components: {
    Navbar,
    Sidebar,
    Bipartite,
    DashboardSummary,
    PageFooter,
    Loader
  },
  data () {
    return {
      model: nch.model
    }
  }
}
