import Logo from './Logo'

export default {
  name: 'navbar',
  template: require('components/layout/Navbar.html'),
  data () {
    return {
      model: nch.model
    }
  },
  components: {
    Logo
  },
  mounted() {
    if( nch.model.loginData !== null ) {
      this.loadData();
    }

    nch.eventDispatcher.$on('loginSuccessful', () => {
      this.loadData();
    })
  },
  methods: {
    loadData() {
      nch.services.userService.notifications().then((response) => {
        this.model.notifications = response.Alerts ? response.Alerts : []
      }).catch((response) => {
        //nch.model.alertMessage.push('Unable to load notifications. ' + response.statusText)
        //nch.model.showAlert = true
      })
    }
  }
}
