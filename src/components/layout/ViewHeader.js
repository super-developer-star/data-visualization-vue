export default {
  name: 'view-header',
  template: require('components/layout/ViewHeader.html'),
  props: ['headerTitle'],
  data () {
    return {
      model: nch.model
    }
  }
}
