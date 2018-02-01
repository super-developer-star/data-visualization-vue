export default {
  name: 'form-login',
  template: require('components/layout/FormLogin.html'),
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
  methods: {
    submitLogin() {

      if( process.env.NODE_ENV !== 'development' && ( this.user.name === null || this.user.name.trim().length === 0 || this.user.password === null || this.user.password.trim().length === 0 ) ){
        nch.model.alertMessage.push('Please enter both your email address and password.')
        nch.model.showAlert = true
        return
      }

      this.model.loggingin = true
      this.$emit('login', this.user)
    }
  }
}
