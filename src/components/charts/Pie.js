import * as d3 from 'd3'

export default {
  name: 'pie',
  props: ['groupByField', 'labelField', 'manufacturerCode', 'chartId', 'filterObject', 'title', 'lock'],
  template: require('components/charts/Pie.html'),
  data() {
    return {
      model: nch.model,
      status: nch.status,
      pieData: [],
      margin: {
        top: 20,
        right: 30,
        bottom: 0,
        left: 0
      },
      breakcrumbHight: 50,
      fvFlag: false
    }
  },
  updated: function() {
    this.loadData()
  },
  watch: {
    'status.redemptionsLoaded': {
      handler: function (newValue, oldValue) {
        if( this.status.redemptionsLoaded ) {
          this.loadData();
        }
      }
    },
    'status.productMovedLoaded': {
      handler: function (newValue, oldValue) {
        if( this.status.productMovedLoaded && this.groupByField === 'productmoved') {
          this.loadData();
        }
      }
    },
    'model.selectedCategories': {
      handler: function () {
        this.loadData()
      }
    },
    '$route' (to, from) {
      this.fvFlag = to.path === '/face-value/range'

      if( to.name === 'FaceValue' ) {
        this.loadData();
      }
    },
    'lock.active': {
      handler: function (newValue, oldValue) {
        if (!newValue && oldValue) {
          this.filterObject.mediaCode = null
          this.filterObject.category = null
          this.filterObject.offerCode = null
          this.filterObject.faceValueCode = null
          this.filterObject.manufacturerCode = null
          this.loadData()
        }
      }
    },
    filterObject: {
      handler: function(updatedFilterObject) {
        if( this.lock && this.lock.active ) {
          return
        }

        // run filter if media code is set by another chart, but not if it is set by this chart
        if( updatedFilterObject.mediaCode !== undefined && updatedFilterObject.mediaCode !== null && this.groupByField !== 'medianame' ) {
          const mediaCode = updatedFilterObject.mediaCode;
          const period = updatedFilterObject.period
          const redemptionData = nch.services.dataService.getRedemptionData(this.manufacturerCode)
          this.pieData = nch.services.filterService.getPieDataByCategoryFiltered( redemptionData, mediaCode, period )
          this.render()
        } else if( updatedFilterObject.classOfTradeCode !== undefined && updatedFilterObject.classOfTradeCode !== null ) {
          const classOfTradeCode = updatedFilterObject.classOfTradeCode
          const period = updatedFilterObject.period
          const redemptionData = nch.services.dataService.getRedemptionData(this.manufacturerCode)
          this.pieData = nch.services.filterService.getPieDataByCategoryFilteredByClassOfTrade( redemptionData, classOfTradeCode, period )
          this.render();
        } else if( updatedFilterObject.faceValueCode !== undefined && updatedFilterObject.faceValueCode !== null ) {
          if(this.groupByField === 'medianame') {
            const manufacturerCode = updatedFilterObject.manufacturerCode
            const faceValueCode = updatedFilterObject.faceValueCode
            const period = updatedFilterObject.period
            var redemptionData = nch.services.dataService.getRedemptionData(manufacturerCode)

            if( this.fvFlag ) {
              redemptionData = nch.services.dataService.getRedemptionDataWithFVRange(manufacturerCode)
            }
            this.pieData = nch.services.filterService.getPieDataByFaceValue(redemptionData, faceValueCode, period)
            this.render()
          } else if(this.groupByField === 'classoftradePaperless') {
            const manufacturerCode = updatedFilterObject.manufacturerCode
            const faceValueCode = updatedFilterObject.faceValueCode
            const period = updatedFilterObject.period
            const redemptionData = nch.services.dataService.getPaperlessRedemptionData( manufacturerCode )
            const PaperlessFaceValue = nch.services.filterService.getPieDataByPaperlessFaceValue( redemptionData, faceValueCode )
            this.pieData = nch.services.filterService.getPieDataByClassOfTrade( PaperlessFaceValue, period )
            this.pieData.sort( function(a, b) { return a.classoftrade < b.classoftrade } )
            this.render()
          }
        } else if( updatedFilterObject.manufacturerCode !== undefined && updatedFilterObject.manufacturerCode !== null ) {
          const manufacturerCode = updatedFilterObject.manufacturerCode // TODO: make sure this is correct
          const period = updatedFilterObject.period
          const redemptionData = nch.services.dataService.getProductMovedForManufacturerData(manufacturerCode)
          this.pieData = nch.services.filterService.getPieDataByProductMoved( redemptionData, period )
          this.render()

        } else {
          this.loadData();
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  mounted() {
    console.log( "Pie Mounted, View" )
    this.fvFlag = this.$route.path === '/face-value/range'
    this.loadData()
    window.addEventListener('resize', this.handleWindowResize)
  },
  methods: {
    loadData() {
      if (this.groupByField === 'categoryname') {
        const redemptionData = nch.services.dataService.getRedemptionData(this.manufacturerCode)
        const categories = nch.services.filterService.getPieDataByCategory( redemptionData )
        categories.sort( function(a, b) { return a.categoryname < b.categoryname } )
        this.pieData = categories
      }
      else if (this.groupByField === 'classoftradePaperless') {
        const redemptionData = nch.services.dataService.getPaperlessRedemptionData(this.manufacturerCode)
        const classOfTradeData = nch.services.filterService.getPieDataByClassOfTrade( redemptionData )
        classOfTradeData.sort( function(a, b) { return a.classoftrade < b.classoftrade } )
        this.pieData = classOfTradeData
      }
      else if (this.groupByField === 'medianame') {
        const code = this.model.manufacturer.code
        var manufacturerFaceValueData = nch.services.dataService.getRedemptionData(code)
        var comparableFaceValueData = nch.services.dataService.getRedemptionData('ALL')

        if( this.fvFlag ) {
          manufacturerFaceValueData = nch.services.dataService.getRedemptionDataWithFVRange(code)
          comparableFaceValueData = nch.services.dataService.getRedemptionDataWithFVRange('ALL')
        }

        const faceValuePieData = manufacturerFaceValueData.concat(comparableFaceValueData)
        this.pieData = nch.services.filterService.getPieDataByMediaType( faceValuePieData )
      } else if (this.groupByField === 'productmoved') {
        const redemptionData = nch.services.dataService.getProductMovedForManufacturerData(this.manufacturerCode)
        this.pieData = nch.services.filterService.processProductMovedPieData( redemptionData );
      }
      this.render()
    },
    handleWindowResize() {
      this.render()
    },
    render() {
      document.getElementById( this.chartId + 'Container' ).innerHTML = "";
      var selector = '#' + this.chartId + 'Container'
      var svg = d3.select( selector ).append( "svg" )
        .attr( "width", 600 )
        .attr( "height", 400 )
        .attr( "id", this.chartId )
        .attr( "xmlns", "http://www.w3.org/2000/svg" )

      var chartWidth = 400

      try {
        var chartNode = d3.select('#' + this.chartId).node()
        chartWidth = chartNode.parentNode.clientWidth
      }
      catch( error ) {
        console.log('Bar error')
        console.log(error)
      }

      svg.attr('width', chartWidth)

      const width = +svg.attr('width') - this.margin.left - this.margin.right
      const height = +svg.attr('height') - this.margin.top - this.margin.bottom
      const radius = Math.min(width / 2, height) / 2 - 10
      if (this.pieData.length === 0) {
        return
      }
      svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '0.32em')
        .attr('fill', this.model.colors.breakcrumbColor)
        .attr('font-family', 'proxima_novaregular')
        .attr('font-size', '1.5em')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .text(this.title)

      let g = svg.append('g')
        .attr('class', 'pieChart')
        .attr('transform', 'translate(' + parseInt(radius + this.margin.left) + ',' + parseInt(height / 2 + this.margin.top) + ')')
      const color = d3.scaleOrdinal(this.model.colors.piecolors)
      let total = 0

      for (let i = 0; i < this.pieData.length; i++) {
        total += this.pieData[i].value
      }

      const pie = d3.pie()
        .sort(null)
        .value(function(d) {
          return d.value
        })

      const arc = g.selectAll('.arc')
        .data(pie(this.pieData))
        .enter().append('g')
        .attr('class', 'arc')

      this.renderMediaTypes(arc, radius, color, total)

      var legendWidth = parseInt(width / 2 + this.margin.left)
      var legendHeight = ((height - this.breakcrumbHight) / 2 - (this.pieData.length * 40) / 2)

      g = svg.append('g')
        .attr('transform', 'translate(' + legendWidth + ',' + parseInt(legendHeight + this.breakcrumbHight) + ')')
      this.renderLegend(g, this.pieData, total, color)

      svg.selectAll('.list, .arc').on('click', () => {
        if( this.lock ) {
          this.lock.active = true
        }
      })
    },

    renderPieChart(data) {
      const svg = d3.select('#' + this.chartId)
      svg.attr('width', d3.select('#' + this.chartId).node().parentNode.clientWidth)
      const width = +svg.attr('width') - this.margin.left - this.margin.right
      const height = +svg.attr('height') - this.margin.top - this.margin.bottom
      const radius = Math.min(width / 2, height) / 2 - 10
      if (data.length === 0) {
        return
      }

      let g = d3.select('#' + this.chartId + ' .pieChart').html('')
      const color = d3.scaleOrdinal(this.model.colors.piecolors)
      let total = 0

      for (let i = 0; i < data.length; i++) {
        total += data[i].value
      }

      const pie = d3.pie()
        .sort(null)
        .value(function(d) {
          return d.value
        })

      const arc = g.selectAll('.arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'arc')

      this.renderMediaTypes(arc, radius, color, total, true)
    },

    renderLegend(g, responseData, total, color) {
      const component = this
      const width = d3.select('#' + this.chartId).attr('width') - this.margin.left - this.margin.right
      const lineHeight = 40
      const groupBy = this.groupByField
      const list = g.selectAll('.list')
        .data(responseData)
        .enter().append('g')
        .attr('class', 'list')

      this.renderLegendTitles( g, width / 3 )
      let yOffset = 20
      list.append('rect')
        .attr("rx", 5)
        .attr("ry", 5)
        .attr('x', 15)
        .attr('y', function(d, i) {
          return i * lineHeight + 5
        })
        .attr('height', 30)
        .attr('width', width / 2 - lineHeight / 2 + 5)
        .attr('fill', 'transparent')

      list.append('text')
        .attr('x', lineHeight / 2 + 15)
        .attr('y', function(d, i) {
          return yOffset + 3 + i * lineHeight
        })
        .attr('font-weight', 'bold')
        .text(function(d) {

          if( groupBy === 'medianame' ) {
            return nch.utils.getMediaAbbreviation(d.name)
          }

          if( d.name.length > 15 ) {
            d.name = d.name.substring(0, 12) + '...'
          }
          return ( d.name );
        })

      list.append('text')
      .attr('x', width / 3 + 30)
      .attr('y', function(d, i) {
        return yOffset + 3 + i * lineHeight
      })
      .attr('font-weight', 'bold')
      .text(function(d) {
        var percentValueFormatted = d3.format('.1%')(d.value / total)
        if( percentValueFormatted === '0.0%') {
          percentValueFormatted = '< 0.1%'
        }
        return (percentValueFormatted);
      })

      list.append('line')
        .attr('y1', function(d, i) {
          return lineHeight + i * lineHeight
        })
        .attr('y2', function(d, i) {
          return lineHeight + i * lineHeight
        })
        .attr('x1', lineHeight / 2 + 15)
        .attr('x2', width / 2)
        .attr('stroke', 'grey')
        .style('stroke-dasharray', '5,5')

      list.append('circle')
        .attr('r', 15)
        .attr('cx', 15)
        .attr('cy', function(d, i) {
          return yOffset + i * lineHeight
        })
        .attr('stroke', 'white')
        .attr('stroke-width', '3px')
        .attr('fill', function(d) {
          for( var i = 0; i < component.pieData.length; i++ ) {
            if( component.pieData[i].id == d.id ) {
              var colorValue = color( i )
              return colorValue;
            }
          }

          return color(0)
        })

      list.append('rect')
        .attr('x', 15)
        .attr('y', function(d, i) {
          return i * lineHeight + 5
        })
        .attr('height', 30)
        .attr('width', width / 2 - lineHeight / 2)
        .attr('fill', 'transparent')

      var localFilter = this.filterObject;
      var localLock = this.lock;

      g.selectAll('.list')
        .on('mouseover', listmouseover)
        .on('mouseout', listmouseout)

      function listmouseover(d) {

        // turn off mouse over events when locked
        if( localLock && localLock.active ) {
          return
        }

        if (groupBy === 'medianame') {
          localFilter.mediaCode = d.id
        }
        else if (groupBy === 'categoryname') {
          localFilter.category = d.id
        }
        else if (groupBy === 'productmoved') {
          localFilter.offerCode = d.id
        }
        else if (groupBy === 'classoftradePaperless') {
          localFilter.category = d.id
        }

        const pieData = component.pieData.map(function(i) {
          if(d !== i) { i.value = 0 }
          return i
        })
        d3.select(this).style('cursor', 'default')
        component.renderPieChart(pieData)
      }

      function listmouseout(d) {
        localFilter.mediaCode = null
        localFilter.category = null
        localFilter.offerCode = null
      }
    },

    renderLegendTitles( g, xpostion ) {
      const groupBy = this.groupByField;
      if (groupBy === 'productmoved') {
        const subtitle = g.append('g')
        subtitle.append('text')
          .attr('y', -15)
          .attr('x', 70)
          .attr('dy', '0.32em')
          .attr('fill', '#000')
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'middle')
          .text('OFFER')
          .attr('fill', '#498fe1')

        subtitle.append('text')
          .attr('x', xpostion + 20)
          .attr('y', -15)
          .attr('dy', '0.32em')
          .attr('fill', '#000')
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'middle')
          .text('REDEMPTION')
          .attr('fill', '#498fe1')
      }
    },

    renderMediaTypes(arc, radius, color, total, fullStatus) {
      const groupBy = this.groupByField
      const path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)
      const out = d3.arc()
        .outerRadius(radius - 6)
        .innerRadius(0)
      const label = d3.arc().outerRadius(radius - 50).innerRadius(radius - 50)
      arc.append('path')
        .attr('d', out)
        .attr('class', 'path')
        .attr('fill', 'white')

      arc.append('path')
        .attr('d', path)
        .attr('class', 'path')
        .attr('fill', function(d) {
          return color(d.index)
        })

      if(fullStatus) {
        arc.append('text')
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'middle')
          .attr('font-size', '1.5em')
          .attr('transform', 'translate(0, -20)')
          .text(function(d) {
            var percentValue = d3.format('.1')(d.data.value / total)
            var pieLabel = groupBy === 'medianame' ? nch.utils.getMediaAbbreviation(d.data.name) : d.data.name
            if(percentValue <= 0.02  || isNaN(percentValue) ) {
              pieLabel = ''
            }
            return pieLabel
          })
          .attr('fill', 'white')
        arc.append('text')
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'middle')
          .attr('transform', 'translate(0, 20)')
          .text(function(d) {
            var percentValue = d3.format('.1')(d.data.value / total)
            var percentValueFormatted = d3.format('.1%')(d.data.value / total)
            if(percentValue <= 0.02  || isNaN(percentValue) ) {
              percentValueFormatted = ''
            }
            return percentValueFormatted
          })
          .attr('fill', 'white')
      } else {
        arc.append('text')
          .attr('font-weight', 'bold')
          .attr('transform', function(d) {
            return 'translate(' + label.centroid(d) + ')'
          })
          .text(function(d) {
            var percentValue = d3.format('.1')(d.data.value / total)
            var percentValueFormatted = d3.format('.1%')(d.data.value / total)
            if(percentValue <= 0.02  || isNaN(percentValue) ) {
              percentValueFormatted = ''
            }
            return percentValueFormatted
          })
          .attr('fill', 'white')
      }

      arc.append('path')
        .attr('d', out)
        .attr('class', 'out')
        .attr('fill', 'transparent')

      var localFilter = this.filterObject;

      arc.selectAll('.out')
        .on('mouseover', piemouseover)
        .on('mouseout', piemouseout)

      function piemouseover(d) {
        if (groupBy === 'medianame') {
          localFilter.mediaCode = d.data.id
        } else if (groupBy === 'categoryname') {
          localFilter.category = d.data.id
        } else if (groupBy === 'productmoved') {
          localFilter.offerCode = d.data.id
        } else if (groupBy === 'classoftradePaperless') {
          localFilter.category = d.data.id
        }
      }

      function piemouseout(d) {
        localFilter.mediaCode = null
        localFilter.category = null
        localFilter.offerCode = null
      }
    }
  }
}
