'use strict';
import LoginModal from 'components/modals/LoginModal'
import TermsModal from 'components/modals/TermsModal'
import FormLogin from 'components/layout/FormLogin'
import Logo from 'components/layout/Logo'

import './styles/home.scss'

export default {
  name: 'home',
  template: require('./Home.html'),
  data () {
    return {
      model: nch.model,
      hasError: false,
      errorMessage: 'Sorry, we did not recognize that email address and password. Please check your entry and try again or call our customer support center.'
    }
  },
  components: {
    FormLogin,
    TermsModal,
    LoginModal,
    Logo
  },
  methods: {
    showLoginModal() {
      return this.hasError
    },
    hideLoginModal() {
      this.hasError = false
    },
    showTerms() {
      this.model.showTerms = true;
    },
    updateTermsStatus() {
      // update user if they agree to the terms and conditions
      // this should only happen if the user has never logged in before
      // cache this value
    },

    allowAccess(){
      if (nch.model.loginData.items.length > 0) {
        nch.model.manufacturer.code = nch.model.loginData.items[0].NrsMfrId
        nch.model.manufacturer.name = nch.model.loginData.items[0].Name
      }

      nch.eventDispatcher.$emit('loginSuccessful');
      this.$router.push('/')
    },
    login(user) {

      nch.services.userService.login(user).then((response) => {
        nch.model.loginData = response
        this.hasError = false

        if( nch.model.loginData.terms !== undefined && nch.model.loginData.terms !== null ) {
          nch.eventDispatcher.$on('termAccepted', () => {
            nch.services.userService.terms( nch.model.loginData.terms.Version )

            // NOTE: should we wait till call returns to allow access?
            this.allowAccess()
          })

          nch.model.terms = nch.model.loginData.terms.Terms
          nch.model.showTerms = true
          return;
        }

        this.allowAccess()
      }).catch((response) => {
        this.hasError = true
      })
    }
  }
}
