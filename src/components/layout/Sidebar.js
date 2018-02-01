import SidebarItem from '../layout/SidebarItem'

import services from 'src/modules/services'

export default {
  name: 'sidebar',
  template: require('components/layout/Sidebar.html'),
  components: {
    SidebarItem
  },
  data () {
    return {
      model: nch.model
    }
  },
  mounted () {
    services.loadSidebarItems().then((sidebarItems) => {
      this.model.sidebarItems = sidebarItems
    }).catch((message) => {
      console.log('Sidebar, loading sidebarItems promise catch:' + message)
    })
  }
}
