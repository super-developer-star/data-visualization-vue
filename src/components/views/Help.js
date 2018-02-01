import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'

import services from 'src/modules/services'

export default {
  name: 'help',
  template: require('components/views/Help.html'),
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
  mounted() {
    console.log( "Help mounted" );
    services.loadHelpItems().then( (helpItems) => {
      this.model.helpItems = helpItems;
      console.log('loading items');
    }).catch( (message) => {
      console.log('Help, loading  helpItems promise catch:' + message)
    });
  }
}
