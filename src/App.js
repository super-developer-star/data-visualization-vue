'use strict'

import './styles/nch.scss'
import AlertModal from 'components/modals/AlertModal'
import TermsModal from 'components/modals/TermsModal'
require('./assets/favicon.ico')
require('./assets/close_1.png')

export default {
  name: 'app',
  template: require('./App.html'),
  components: {
    AlertModal,
    TermsModal
  },
  data () {
    return {
      model: nch.model
    }
  }
}
