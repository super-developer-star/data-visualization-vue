export default {
  name: 'login-modal',
  template: require('components/modals/LoginModal.html'),
  props: ['hasError', 'errorMessage', 'hideLoginModal'],
  data () {
    return {
      model: nch.model,
      user: {
        name: null,
        password: null,
        terms: false
      }
    }
  },
  computed: {
    show: function () {
      return this.model.showLogin;
    },
    resetUrl: function () {
      var url = 'https://accountmanagement.nchmarketing.com/beacon/'

      if( window.location.hostname.indexOf('d1') > 0 || window.location.hostname.indexOf('q1') > 0 ) {
        url = 'https://accountmanagement-dev.nchmarketing.com/beacon/'
      }

      return url
    }
  },
  methods: {
    submitLogin() {
      this.$emit('login', this.user)
    }
  }
}
