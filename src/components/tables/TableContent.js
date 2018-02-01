import * as d3 from 'd3'
import Popper from 'vue-popperjs'

export default {
  name: 'table-content',
  template: require('./TableContent.html'),
  props: {
    categories: {
      type: Array,
      default: []
    }
  },
  components: {
    'popper': Popper
  },
  data () {
    return {
      model: nch.model,
      currentManufacturer: nch.model.manufacturer.name,
      compareManufacturer: 'Comparables',
      manufacturerCategoryData: null,
      comparableCategoryData: null
    }
  },
  mounted() {
    var component = this;
    nch.eventDispatcher.$on('dataLoaded', function() {
      component.loadData();
    })
    nch.eventDispatcher.$on('dataRefreshed', function() {
      component.loadData();
    })
  },
  watch: {
    categories: function(updatedselectedCategories) {
      this.loadData();
    }
  },
  methods: {
    getTableValue(category, mediaName, period, manufacturerCode) {
      if( this.manufacturerCategoryData === null ) {
        console.log( "manufacturerCategoryData not set yet" )
        this.loadData();

        if( this.manufacturerCategoryData === null )
          return 0
      }

      var groupedData = manufacturerCode === 'ALL' ? this.comparableCategoryData : this.manufacturerCategoryData

      var mediaCode = nch.utils.getMediaCode(mediaName)
      var categoryMediaId = '' + category.categorycode + '' + mediaCode
      var categoryMediaObject = groupedData[categoryMediaId]

      if (categoryMediaObject === undefined || categoryMediaObject === null) {
        return 0
      }

      var total = nch.utils.getTotalByMediaType( category, period, groupedData );

      if( total === 0 ) {
        return 0
      }

      var roundingFunction = d3.format('.1%')

      if (period === 1) {
        var result = roundingFunction(categoryMediaObject.totalredemptionsp1/total)
        return result;
      }
      else {
        var result =  roundingFunction(categoryMediaObject.totalredemptionsp2/total)
        return result;
      }
    },
    loadData() {
      var manufacturerData = nch.services.dataService.getRedemptionData(this.model.manufacturer.code)
      this.manufacturerCategoryData = nch.services.filterService.processRedemptionsByCategoryAndMediaType(manufacturerData)

      var comparableData = nch.services.dataService.getRedemptionData('ALL')
      this.comparableCategoryData = nch.services.filterService.processRedemptionsByCategoryAndMediaType(comparableData)
    },

    formattedValue(value) {
      return d3.format('(.2f')(value)
    },
    periodString(period) {
      if (period.type === 'year') {
        return period.year
      }
      else if (period.type === 'quarter') {
        var quarter = parseInt(period.code.toString().slice(4))
        var suffix = nch.utils.getPeriodSuffixLabel(quarter) + ' Quarter'
        return period.code.toString().slice(0, 4) + ' : ' + suffix
      }
      else if (period.type === 'week') {
        var week = parseInt(period.code.toString().slice(4))
        var suffix = nch.utils.getPeriodSuffixLabel(week) + ' Week'
        return period.code.toString().slice(0, 4) + ' : ' +  suffix
      }
      else if (period.type === 'month') {
        var month = parseInt(period.code.toString().slice(4))
        var monthName = nch.utils.getMonth(month)
        return monthName + ' ' + period.code.toString().slice(0, 4)
      }
    },
    getIcon(mediaValue) {
      if (mediaValue === 'FSI') {
        return 'icon-scissors'
      } else if (mediaValue === 'Print At Home') {
        return 'icon-printer'
      } else if (mediaValue === 'Handout Electronic Checkout') {
        return 'icon-register'
      } else if (mediaValue === 'Military') {
        return 'icon-military'
      } else {
        return 'fa-file-o'
      }
    },

    // ["FSI", "Handout Electronic Checkout", "Print At Home", "Military", "Other Paper"],
    getLabel(mediaValue) {
      return nch.utils.getMediaAbbreviation(mediaValue)
    }
  }
}
