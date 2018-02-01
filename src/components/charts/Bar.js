import * as d3 from 'd3'

export default {
  name: 'bar',
  props: ['groupByField', 'manufacturerCode', 'chartId', 'filterObject', 'showBreadcrumb', 'lock'],
  template: require('components/charts/Bar.html'),
  data () {
    return {
      model: nch.model,
      status: nch.status,
      barData: {},
      legendKeys: [],
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      mediaSortValue: nch.constants.mediaTypeLabels,
      breakcrumbHight: 50,
      barChartTitleSize: 15
    }
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
        if (this.isMarketChart()) {
          nch.services.marketService.resetGeoMediaData(this.manufacturerCode, this.groupByField)
          this.loadMarketMediaData(this.groupByField)
        }
      }
    },
    'model.period1': {
      handler: function () {
        if (this.isMarketChart()) {
          nch.services.marketService.resetGeoMediaData(this.manufacturerCode, this.groupByField)
          this.loadMarketMediaData(this.groupByField)
        }
      }
    },
    groupByField: {
      handler: function (newValue, oldValue) {
        if (this.isMarketChart()) {
          this.loadMarketMediaData(this.groupByField)
        }
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
          this.filterObject.marketCode = null

          this.refreshData();
        }
      }
    },
    filterObject: {
      handler: function (updatedFilterObject) {
        if( this.lock && this.lock.active ) {
          return
        }

        if (updatedFilterObject.category !== null && this.groupByField === 'classOfTrade') {
          var redemptionsByClassOfTrade = nch.services.dataService.getRedemptionsByClassOfTradeForCategory(this.manufacturerCode, updatedFilterObject.category);
          this.barData = nch.services.filterService.convertToPercentage(redemptionsByClassOfTrade)
          this.render()
        } else if (updatedFilterObject.category !== null && this.groupByField === 'mediaType') {
          var redemptionsByMediaCode = nch.services.dataService.getRedemptionsByMediaForCategory(this.manufacturerCode, updatedFilterObject.category);
          this.barData = nch.services.filterService.convertToPercentage(redemptionsByMediaCode)
          this.render()
        } else if (updatedFilterObject.offerCode !== null && this.groupByField === 'productmoved') {
          const code = this.model.manufacturer.code
          const manufacturerProductMovedData = nch.services.dataService.getProductMovedForManufacturerData(code)
          const manufacturerProductMovedBarData = nch.services.filterService.processProductMovedForOffset(manufacturerProductMovedData, code, updatedFilterObject.offerCode)
          const comparableProductMovedData = nch.services.dataService.getProductMovedForManufacturerData('ALL')
          const comparableProductMovedBarData = nch.services.filterService.processProductMovedForOffset(comparableProductMovedData, 'ALL', updatedFilterObject.offerCode)
          this.barData = {manufacturerProductMovedBarData, comparableProductMovedBarData}
          this.render()
        } else if (updatedFilterObject.marketCode !== undefined && updatedFilterObject.marketCode !== null) {
          var marketMediaData = nch.services.marketService.getGeoMediaData(this.manufacturerCode, this.groupByField)
          var filteredData = nch.services.filterService.getMarketData(marketMediaData, updatedFilterObject.marketCode)
          var redemptionsByMediaCode = nch.services.dataService.processRedemptionsByMarketMedia(filteredData)
          this.barData = nch.services.filterService.convertToPercentage(redemptionsByMediaCode)
          this.render()
        } else if (updatedFilterObject.marketCode === null && (this.groupByField === 'nielsen' || this.groupByField === 'dma' || this.groupByField === 'iri')) {
          var marketMediaData = nch.services.marketService.getGeoMediaData(this.manufacturerCode, this.groupByField)
          this.barData = nch.services.dataService.processRedemptionsByMarketMedia(marketMediaData)
          this.initLegendKeys();
          this.render()
        } else {
          this.loadData()
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  mounted () {
    if (this.groupByField === 'nielsen' || this.groupByField === 'dma' || this.groupByField === 'iri') {
      this.loadMarketMediaData(this.groupByField)
      window.addEventListener('resize', this.handleWindowResize)
      return;
    }

    this.loadData();
    window.addEventListener('resize', this.handleWindowResize)
  },

  methods: {
    refreshData() {
      if (this.isMarketChart()) {
        this.loadMarketMediaData(this.groupByField)
      }
      else {
        this.loadData()
      }
    },

    loadData() {
      if (this.groupByField === 'classOfTrade') {
        const redemptionsByClassOfTrade = nch.services.dataService.getRedemptionsByClassOfTrade(this.manufacturerCode);
        this.barData = nch.services.filterService.convertToPercentage(redemptionsByClassOfTrade)
      } else if (this.groupByField === 'mediaType') {
        const redemptionsByMediaCode = nch.services.dataService.getRedemptionsByMedia(this.manufacturerCode);
        this.barData = nch.services.filterService.convertToPercentage(redemptionsByMediaCode)
      } else if (this.groupByField === 'productmoved') {
        const code = this.model.manufacturer.code
        const manufacturerProductMovedData = nch.services.dataService.getProductMovedForManufacturerData(code)
        const manufacturerProductMovedBarData = nch.services.filterService.processProductMoved(manufacturerProductMovedData, code)
        const comparableProductMovedData = nch.services.dataService.getProductMovedForManufacturerData('ALL')
        const comparableProductMovedBarData = nch.services.filterService.processProductMoved(comparableProductMovedData, 'ALL')
        this.barData = {manufacturerProductMovedBarData, comparableProductMovedBarData}
      } else if (this.groupByField === 'redemptionIndex') {
        const code = this.model.manufacturer.code
        const manufacturerData = nch.services.dataService.getProductMovedForManufacturerData(code)
        const manufacturerBarData = nch.services.filterService.processRedemptionIndex(manufacturerData, code)
        const comparableData = nch.services.dataService.getProductMovedForManufacturerData('ALL')
        const comparableProductData = nch.services.filterService.processRedemptionIndex(comparableData, 'ALL')
        this.barData = {manufacturerBarData, comparableProductData}
      }
      this.initLegendKeys();
      this.render();
    },

    loadMarketMediaData (marketType) {
      var marketMediaData = nch.services.marketService.getGeoMediaData(this.manufacturerCode, marketType)

      // use cached version
      if( marketMediaData.length > 0 ) {
        this.barData = nch.services.dataService.processRedemptionsByMarketMedia(marketMediaData)
        this.initLegendKeys();
        this.render()
        return
      }

      nch.services.dataService.loadMarketDataByMedia(this.manufacturerCode, marketType).then((response) => {
        nch.services.marketService.setGeoMediaData(this.manufacturerCode, marketType, response)
        console.log('Loaded market data, manufacturer:' + this.manufacturerCode + ', market type: ' + marketType + ", total: " + response.length )
        this.barData = nch.services.dataService.processRedemptionsByMarketMedia(response)
        this.initLegendKeys();
        this.render()
      }).catch((message) => {
        console.log('NielsenMarket, loadMarketData promise catch:' + message)
        // nch.model.alertMessage.push('Unable to load NielsenMarket Media data')
        // nch.model.showAlert = true
      })
    },
    initLegendKeys() {
      var period1 = nch.utils.getTimePeriodLabel(this.model.period1)
      var period2 = nch.utils.getTimePeriodLabel(this.model.period2)

      if (period1 === '') {
        period1 = 'period1'
        period2 = 'period2'
      }

      this.legendKeys = [period1, period2]
    },
    handleWindowResize() {
      this.render()
    },
    render() {

      if (this.showBreadcrumb !== 'true') {
        this.breakcrumbHight = 0
      }

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

      const chartHeight = height - this.breakcrumbHight - this.barChartTitleSize - 50

      let breadcrumbTitle = ''
      if (this.model && this.model.breadcrumbTitle) {
        breadcrumbTitle = this.model.breadcrumbTitle
      }
      const breadcrumb = svg.append('g')
        .attr('transform', 'translate(' + 0 + ',' + this.margin.top + ')')
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '0.32em')
        .attr('fill', this.model.colors.breakcrumbColor)
        .attr('font-family', 'proxima_novaregular')
        .attr('font-size', '1.4em')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
      if (this.showBreadcrumb === 'true') {
        breadcrumb.text(breadcrumbTitle)
        breadcrumb.call(this.wrap, width)
      }

      const that = this
      var x = d3.scaleBand().rangeRound([20, width]).padding(0.2),
        y = d3.scaleLinear().rangeRound([chartHeight, this.barChartTitleSize * 2]),
        z = d3.scaleOrdinal().range(this.model.colors.barcolors)

      var defs = svg.append('defs')
      var filter = defs.append('filter')
        .attr('id', 'drop-shadow')
        .attr('height', '130%')

      filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 2)
        .attr('result', 'blur')

      filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 2)
        .attr('dy', 0)
        .attr('result', 'offsetBlur')

      var feMerge = filter.append('feMerge')

      feMerge.append('feMergeNode')
        .attr('in', 'offsetBlur')
      feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic')

      var g = svg.append('g')
        .attr('transform', 'translate(' + parseInt(this.margin.left) + ',' + parseInt(this.margin.top + this.breakcrumbHight) + ')')
      var chartData = this.barData
      let data
      const tempData = Object.keys(chartData).map(function (d) {
        return chartData[d]
      })

      if (this.groupByField === 'mediaType' ||
        this.groupByField === 'marketType' ||
        this.groupByField === 'nielsen' ||
        this.groupByField === 'dma' ||
        this.groupByField === 'iri') {
        data = nch.utils.speicalSort(this.mediaSortValue, tempData, 'name')
      } else {
        data = tempData
      }
      x.domain(data.map(function (d) {
        return d.name
      }))
      y.domain([0, d3.max(data, function (d) {
        return ((d.totalredemptionsp1 > d.totalredemptionsp2) ? (d.totalredemptionsp1) : (d.totalredemptionsp2))
      })]).nice()

      var chartLabel = nch.utils.getManufacturerName(this.manufacturerCode);

      if (this.groupByField !== 'productmoved' && this.groupByField !== 'redemptionIndex') {
        g.append('text')
          .attr('x', width / 2)
          .attr('font-weight', 'bold')
          .style('text-anchor', 'middle')
          .attr('y', this.barChartTitleSize)
          .text(chartLabel)
          .attr('font-size', this.barChartTitleSize)
          .attr('fill', this.model.breakcrumbColor)
      }

      g.append('g')
        .selectAll('g')
        .data(data)
        .enter().append('text')
        .attr('x', function (d) {
          return x.bandwidth() / 2 + x(d.name)
        })
        .attr('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .attr('y', chartHeight + 20)
        .text(function (d) {
          return d.name
        })

      const axisData = y.ticks()

      g.append('g')
        .selectAll('g')
        .data(axisData)
        .enter().append('line')
        .attr('y1', function (d) {
          return y(d)
        })
        .attr('y2', function (d) {
          return y(d)
        })
        .attr('x1', this.margin.left + 10 + 5)
        .attr('x2', width)
        .attr('stroke', 'grey')
        .style('stroke-dasharray', '5, 5')

      // render y axis
      g.append('g')
        .selectAll('g')
        .data(axisData)
        .enter().append('text')
        .attr('y', function (d) {
          return y(d) + 5
        })
        .attr('x', this.margin.left + 10)
        .text(function (d) {
          if (that.groupByField === 'productmoved' || that.groupByField === 'redemptionIndex') {
            return d
          } else {
            if (d < 1000) return d3.format('.0%')(d)
            else return parseInt(d / 1000) + 'K %'
          }
        })
        .style('text-anchor', 'end')
        .attr('fill', 'grey')

      data.map(function (i) {
        i.label = that.legendKeys
      })
      const period1Bar = g.append('g')
        .selectAll('g')
        .data(data)
        .enter()
      period1Bar.append('rect')
        .attr('class', 'bar bar1')
        .attr('x', function (d) {
          return x(d.name)
        })
        .attr('y', function (d) {
          return y(d.totalredemptionsp1)
        })
        .attr('width', x.bandwidth() / 2)
        .attr('height', function (d) {
          return chartHeight - y(d.totalredemptionsp1) + 2
        })
        .transition()
        .duration(1000)
        .attr('stroke', 'white')
        .attr('fill', z(this.legendKeys[0]))
        .attr('stroke-width', '2px')
        .style('filter', 'url(#drop-shadow)')
      period1Bar.append('text')
        .attr('x', function (d) {
          return x(d.name) + x.bandwidth() / 4
        })
        .attr('y', function (d) {
          return y(d.totalredemptionsp1) - 10
        })
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-size', '11px')
        .attr('text-anchor', 'middle')
        .text(function (d) {
          if (that.groupByField === 'productmoved' || that.groupByField === 'redemptionIndex') {
            return d.totalredemptionsp1
          } else {
            return (d3.format('.1%')(d.totalredemptionsp1))
          }
        })

      const period2Bar = g.append('g')
        .selectAll('g')
        .data(data)
        .enter()
      period2Bar.append('rect')
        .attr('class', 'bar bar2')
        .attr('x', function(d) {
          return x(d.name) + x.bandwidth() / 2
        })
        .attr('y', function (d) {
          return y(d.totalredemptionsp2)
        })
        .attr('width', x.bandwidth() / 2)
        .attr('height', function (d) {
          return chartHeight - y(d.totalredemptionsp2) + 2
        })
        .transition()
        .duration(1000)
        .attr('stroke', 'white')
        .attr('fill', z(this.legendKeys[1]))
        .attr('stroke-width', '2px')
        .style('filter', 'url(#drop-shadow)')

      period2Bar.append('text')
        .attr('x', function (d) {
          return x(d.name) + x.bandwidth() * 3 / 4
        })
        .attr('y', function (d) {
          return y(d.totalredemptionsp2) - 10
        })
        .attr('dy', '0.32em')
        .attr('font-size', '11px')
        .attr('fill', '#000')
        .attr('text-anchor', 'middle')
        .text(function (d) {
          if (that.groupByField === 'productmoved' || that.groupByField === 'redemptionIndex') {
            return d.totalredemptionsp2
          } else {
            return (d3.format('.1%')(d.totalredemptionsp2))
          }
        });

      svg.selectAll('.bar1')
        .on('mouseover', bar1mouseover)
        .on('mouseout', barmouseout)

      svg.selectAll('.bar2')
        .on('mouseover', bar2mouseover)
        .on('mouseout', barmouseout)

      svg.selectAll('.bar1, .bar2').on('click', () => {
        if( this.lock && !this.isMarketChart() ) {
          this.lock.active = true
        }
      })

      var localFilter = this.filterObject
      var groupBy = this.groupByField
      var localLock = this.lock;

      function bar1mouseover(d) {
        if (groupBy === 'classOfTrade') {
          localFilter.classOfTradeCode = d.id
        } else if (groupBy === 'mediaType') {
          localFilter.mediaCode = d.id
        } else if (groupBy === 'productmoved') {
          localFilter.manufacturerCode = d.id
        }

        localFilter.period = 1
        if (that.showBreadcrumb === 'true') {
          that.renderBreadcrumb(breadcrumb, chartLabel, d.label[0], d.name, groupBy)
        }
      }

      function bar2mouseover(d) {
        if (groupBy === 'classOfTrade') {
          localFilter.classOfTradeCode = d.id
        } else if (groupBy === 'mediaType') {
          localFilter.mediaCode = d.id
        } else if (groupBy === 'productmoved') {
          localFilter.manufacturerCode = d.id
        }

        localFilter.period = 2

        if (that.showBreadcrumb === 'true') {
          that.renderBreadcrumb(breadcrumb, chartLabel, d.label[1], d.name, groupBy)
        }
      }

      function barmouseout(d) {
        if( localLock && localLock.active ) {
          return
        }

        localFilter.mediaCode = null
        localFilter.classOfTradeCode = null
        localFilter.manufacturerCode = null

        let breadcrumbTitle = ''
        if (that.model && that.model.breadcrumbTitle) {
          breadcrumbTitle = that.model.breadcrumbTitle
        }

        if (that.showBreadcrumb === 'true') {
          breadcrumb.text(breadcrumbTitle)
          breadcrumb.call(that.wrap, width)
        }
      }

      var legendG = svg.append('g')
        .attr('transform', 'translate(0,' + (chartHeight + this.margin.top + this.breakcrumbHight + 40) + ')');
      this.renderLegend(legendG, this.legendKeys, z, width, groupBy);
    },

    renderBreadcrumb (breadcrumb, mfrname, period, mediaName, groupByField) {
      if( this.lock && this.lock.active ) {
        return
      }

      var title = ''
      if (this.model && this.model.breadcrumbTitle) {
        title = this.model.breadcrumbTitle
      }
      if (groupByField === 'productmoved' || groupByField === 'redemptionIndex') breadcrumb.text(title + ': ' + mediaName + ' > ' + period)
      else breadcrumb.text(title + ': ' + mfrname + ' > ' + period + ' > ' + mediaName)
      const width = d3.select('#' + this.chartId).node().parentNode.clientWidth - this.margin.left - this.margin.right
      breadcrumb.call(this.wrap, width)
    },

    wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.5, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 10).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 10).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    },

    renderLegend (g, keys, z, xposition) {
      const that = this
      g.append('g')
        .append('text')
        .attr('x', xposition / 2 + this.margin.left)
        .attr('y', 0)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text('Period Legend');

      const legend = g.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 14)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .selectAll('g')
        .data(keys.slice())
        .enter().append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + (i * parseInt(xposition / 2 + that.margin.left)) + ',' + 0 + ')'
        });
      legend.append('circle')
        .attr('r', 10)
        .attr('cx', parseInt(xposition / 4 - 20))
        .attr('cy', 21)
        .attr('fill', z)
        .attr('stroke', 'white')
        .attr('stroke-width', '3px')

      legend.append('text')
        .attr('x', parseInt(xposition / 4))
        .attr('y', 20)
        .attr('text-anchor', 'start')
        .attr('dy', '0.4em')
        .text(function (d) {
          return d
        });
    },

    isMarketChart() {
      return this.groupByField === 'nielsen' || this.groupByField === 'dma' || this.groupByField === 'iri'
    }
  }
}
