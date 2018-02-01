import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Geo from '../charts/Geo'
import Bipartite from '../charts/Bipartite'
import PageFooter from '../layout/PageFooter'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'
import Loader from '../layout/Loader'
import MarketData from './MarketData'
import Bar from '../charts/Bar'

export default {
  name: 'geographic',
  template: require('components/views/Geographic.html'),
  props: ['view'],
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    Geo,
    Bipartite,
    PageFooter,
    Download,
    ViewHeader,
    Loader,
    MarketData,
    Bar
  },
  data () {
    return {
      model: nch.model,
      comparableFilter: {
        category: null,
        mediaCode: null,
        period: null
      },
      manufacturerFilter: {
        category: null,
        mediaCode: null,
        period: null
      }
    }
  },
  mounted () {
    console.log('Geographic view: ' + this.view)
  }
}
