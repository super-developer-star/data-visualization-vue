import TableContent from 'src/components/tables/TableContent'
import Download from '../layout/Download'

export default {
  name: 'dynamic-table',
  template: require('./DynamicTable.html'),
  components: {
    TableContent,
    Download
  },
  props: {
    category: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      model: nch.model,
      selectedCategories: {},
      isShow: false,
      showDownloadOptions: false
    }
  },
  watch: {
    category: function(updatedselectedCategories) {
      this.selectedCategories = updatedselectedCategories
      this.updateTableData(updatedselectedCategories)
    }
  },
  mounted() {
    var component = this;
    nch.eventDispatcher.$on('dataLoaded', function() {
      component.updateTableData(component.model.selectedCategories)
    })
    this.updateTableData(this.model.selectedCategories)
  },
  methods: {
    updateTableData(categories) {
      this.selectedCategories = categories
    }
  }
}
