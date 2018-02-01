import NielsenMarket from '../charts/NielsenMarket'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'
import Loader from '../layout/Loader'
import Bar from '../charts/Bar'

export default {
  name: 'MarketData',
  template: require('components/views/MarketData.html'),
  props: ['marketType', 'view'],
  components: {
    Download,
    ViewHeader,
    Loader,
    NielsenMarket,
    Bar
  },
  'marketType': {
    handler: function (newValue, oldValue) {
      this.lock.active = false // don't allow lock to persist view changes
    }
  },
  data () {
    return {
      model: nch.model,
      lock: {
        active: false
      },
      marketFilter: {
        marketCode: null
      }
    }
  },
  computed: {
    marketLabel() {
      return nch.utils.getMarketLabel( this.marketType )
    },
    manufacturerGeoId() {
      return 'marketChart_' + this.marketType + '_manufacturer'
    },
    comparableGeoId() {
      return 'marketChart_' + this.marketType + '_ALL'
    }
  },
  methods: {
    onUnlock() {
      this.lock.active = false
    }
  }
}
