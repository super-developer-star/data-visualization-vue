import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'

export default {
  name: 'settings',
  template: require('components/views/Settings.html'),
  components: {
    Navbar,
    Sidebar,
    PageFooter,
    ViewHeader
  },
  data () {
    return {
      model: nch.model
    }
  },
  computed: {},
  mounted () {
    console.log('Settings mounted')
  },
  methods: {
    onManufacturerClick( manufacturer ) {
      this.model.manufacturer.code = manufacturer.NrsMfrId
      this.model.manufacturer.name = manufacturer.Name
      nch.services.sectorCategoryService.init();
      nch.services.timePeriodService.init();
      nch.router.push({ name: 'Dashboard'})
    }
  }
}
