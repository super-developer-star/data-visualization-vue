export default {
  name: 'AlertModal',
  template: require('components/modals/AlertModal.html'),

  data () {
    return {
      model: nch.model
    }
  },
  mounted() {
    //this.showAlertModal('You are sucessfully logged in. Have fun!')
  },
  methods: {
    onOkClick() {
      this.model.alertMessage = []
      this.model.showAlert = false
    },
    showAlertModal(message) {
      this.model.alertMessage = message
      this.model.showAlert = true
    }
  }
}
