export default {
  name: 'SidebarItem',
  template: require('components/layout/SidebarItem.html'),
  props: ['item'],
  data () {
    return {
      model: nch.model
    }
  }
}
