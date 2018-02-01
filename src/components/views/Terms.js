import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'

export default {
  name: 'Terms',
  template: require('components/views/Terms.html'),
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
