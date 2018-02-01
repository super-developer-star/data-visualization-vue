export default {
  name: 'filter-sector',
  template: require('components/modals/FilterSector.html'),
  props: {
    sector: {
      type: Object,
      default: {}
    },
    categories: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      selectedCategories: []
    }
  },
  mounted() {
    const that = this
    nch.eventDispatcher.$on('resetCategory', function(val) {
      if( val !== that.sector )
        that.selectedCategories = []
    })
    nch.eventDispatcher.$on('selectCategories', function(val) {
      that.selectedCategories = []
      val.map(function(d) {
        if(d.sectorname === that.sector.sectorname  && d.sectorname === that.sector.sectorname) {
          that.selectedCategories.push(d)
        }
      })
    })
  },
  methods: {
    selectAll(items) {
      this.selectedCategories = items
      nch.eventDispatcher.$emit('resetCategory', this.sector)
      nch.eventDispatcher.$emit('updateCategories', this.selectedCategories, this.sector)
    },
    clearAll(items) {
      this.selectedCategories = []
      nch.eventDispatcher.$emit('resetCategory', this.sector)
      nch.eventDispatcher.$emit('updateCategories', this.selectedCategories, this.sector)
    },
    clickItem(val) {
      nch.eventDispatcher.$emit('resetCategory', this.sector)
      nch.eventDispatcher.$emit('updateCategories', this.selectedCategories, this.sector)
    },
    sectorIsSelected( sector ) {
      for( var i = 0; i < this.selectedCategories.length; i++ ) {
        if( sector.sectorcode === this.selectedCategories[i].sectorcode ) {
          return true
        }
      }

      return false
    }
  }
}
