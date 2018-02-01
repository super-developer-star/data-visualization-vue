import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'

export default {
  name: 'Privacy',
  template: require('components/views/Privacy.html'),
  components: {
    PageFooter,
    ViewHeader
  },
  data () {
    return {
      model: nch.model
    }
  }
}
