export default {
  name: 'terms-modal',
  template: require('components/modals/TermsModal.html'),
  data () {
    return {
      model: nch.model
    }
  },
  computed: {
    show: function () {
      return this.model.showTerms;
    }
  },
  methods: {
    ok() {
      nch.eventDispatcher.$emit('termAccepted');
      this.model.showTerms = false;
    },
    onClose() {
      this.model.showTerms = false;
    },
    handleScroll( evt ) {
      let height = this.$refs.termsSlot.clientHeight;
    	
      if ( evt.currentTarget.scrollTop  >= height - evt.currentTarget.offsetHeight ) {
    	this.model.readTerms = false;
      }
    }
  }
}
