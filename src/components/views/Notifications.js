import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'

export default {
  name: 'notifications',
  template: require('components/views/Notifications.html'),
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
  }
}
