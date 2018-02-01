import * as d3 from 'd3'

export default {
  name: 'stacked-bar',
  props: ['groupByField', 'labelField', 'filterObject', 'chartId', 'lock'],
  template: require('components/charts/StackedBar.html'),
  data () {
    return {
      model: nch.model,
      status: nch.status,
      stackedData: [],
      legendKeys: [],
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 10
      },
      breakcrumbHight: 50
    }
  },
  watch: {
    'status.redemptionsLoaded': {
      handler: function (newValue, oldValue) {
        console.log('StackedBar, redemptionsLoaded changed, view: ' + this.groupByField + ', value: ' + this.status.redemptionsLoaded)
        if (this.status.redemptionsLoaded) {
          this.loadData();
        }
      }
    },
    'status.paperlessRedemptionsLoaded': {
      handler: function (newValue, oldValue) {
        if (this.status.paperlessRedemptionsLoaded) {
          this.loadData();
        }
      }
    },
    'model.selectedCategories': {
      handler: function () {
        console.log('StackedBar, categories changed, view: ' + this.groupByField)
        this.loadData()
      }
    },
    'lock.active': {
      handler: function (newValue, oldValue) {
        if (!newValue && oldValue) {
          this.filterObject.mediaCode = null
          this.filterObject.category = null
          this.filterObject.offerCode = null
          this.loadData()
        }
      }
    },
    filterObject: {
      handler: function (updatedFilterObject) {
        if( this.lock && this.lock.active ) {
          return
        }

        // run filter if media code is set by another chart, but not if it is set by this chart
        if (updatedFilterObject.mediaCode !== null && this.groupByField === 'facevalue') {
          const faceValueData = nch.services.dataService.getFaceValueRangeDataByMedia(updatedFilterObject.mediaCode)
          this.stackedData = this.formatFaceValueData(faceValueData)
          this.render()
        }
        else if (updatedFilterObject.mediaCode !== null && this.groupByField === 'facevalueunit') {
          const faceValueData = nch.services.dataService.getFaceValueDataByMedia(updatedFilterObject.mediaCode)
          this.stackedData = this.formatFaceValueData(faceValueData)
          this.render()
        }
        else if (updatedFilterObject.category !== null && this.groupByField === 'facevaluePaperless') {
          const faceValueData = nch.services.dataService.getFaceValueDataByCategory(updatedFilterObject.category)
          this.stackedData = this.formatData(faceValueData)
          this.render()
        } else {
          this.loadData()
        }
      },
      deep: true
    }
  },
  updated: function () {
    this.loadData()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  mounted () {
    console.log('Stacked Bar mounted: ')
    this.loadData()
    window.addEventListener('resize', this.handleWindowResize)
  },
  methods: {
    loadData() {
      console.log('Loading data for stacked bar chart, view: ' + this.groupByField)
      if (this.groupByField === 'facevalue') {
        this.stackedData = this.getFaceRangeData()
      }
      else if (this.groupByField === 'facevalueunit') {
        this.stackedData = this.getFaceData()
      }
      else if (this.groupByField === 'facevaluePaperless') {
        this.stackedData = this.getPaperlessFaceData()
      }

      console.log('Data loaded for stacked bar chart')
      console.log(this.stackedData)
      this.render()
    },
    handleWindowResize() {
      this.render()
    },
    render() {
      const responseData = this.stackedData
      if (responseData.length === 0) {
        return
      }

      const groupBy = this.groupByField

      let breadcrumbTitle = ''

      if (groupBy === 'facevaluePaperless') {
        breadcrumbTitle = 'Face Value Redeemed'
      }
      else if (groupBy === 'facevalueunit') {
        breadcrumbTitle = 'Face Value Per Unit Redeemed'
      }
      else if (this.model && this.model.breadcrumbTitle) {
        breadcrumbTitle = this.model.breadcrumbTitle
      }

      document.getElementById(this.chartId + 'Container').innerHTML = "";
      var selector = '#' + this.chartId + 'Container'
      var svg = d3.select(selector).append("svg")
        .attr("width", 600)
        .attr("height", 400)
        .attr("id", this.chartId)
        .attr("xmlns", "http://www.w3.org/2000/svg")

      var chartWidth = 400

      try {
        var chartNode = d3.select('#' + this.chartId).node()
        chartWidth = chartNode.parentNode.clientWidth
      }
      catch (error) {
        console.log('StackedBar error')
        console.log(error)
      }

      svg.attr('width', chartWidth)
      const width = +svg.attr('width') - this.margin.left - this.margin.right
      const height = +svg.attr('height') - this.margin.top - this.margin.bottom
      const breadcrumb = svg.append('g')
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
        .text(breadcrumbTitle)

      let g = svg.append('g').attr('transform', 'translate(' + 120 + ',' + parseInt(this.margin.top + this.breakcrumbHight) + ')')
      const x = d3.scaleBand()
        .rangeRound([0, width - 240])
        .paddingInner(0.25)
        .align(0.1)

      const y = d3.scaleLinear()
        .rangeRound([0, height - this.breakcrumbHight - 50])

      const z = d3.scaleOrdinal()
        .range(this.model.colors.stackedbarcolors)

      let keys = []

      if (groupBy === 'facevalue' || groupBy === 'facevalueunit' || groupBy === 'facevaluePaperless') {
        x.domain(responseData.map(function (d) {
          return d.mfrname
        }))
        y.domain([d3.max(responseData, function (d) {
          return d3.max(d, function (v) {
            return v.total
          })
        }), 0]).nice()
        z.domain(keys)
      }

      const defs = svg.append('defs')
      const filter = defs.append('filter')
        .attr('id', 'drop-shadow')
        .attr('height', '130%')

      filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 2)
        .attr('result', 'blur')

      filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 1)
        .attr('dy', 0)
        .attr('result', 'offsetBlur')

      const feMerge = filter.append('feMerge')
      feMerge.append('feMergeNode').attr('in', 'offsetBlur')
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

      if (groupBy === 'facevalue' || groupBy === 'facevalueunit' || groupBy === 'facevaluePaperless') {
        this.renderFaceValue(g, height - this.breakcrumbHight, x, y, z, responseData, this.legendKeys.reverse())
      }

      svg.selectAll('.faceValueBar')
        .on('mouseover', onFaceValueMouseOver)
        .on('mouseout', onMouseOut)

      svg.selectAll('.faceValueBar').on('click', () => {
        if( this.lock ) {
          this.lock.active = true
        }
      })

      const localFilter = this.filterObject
      keys = this.legendKeys
      const that = this

      function onFaceValueMouseOver(d) {
        const blockValue = d[1] - d[0]
        localFilter.manufacturerCode = d.data.manufacturerCode
        localFilter.period = d.data.period
        const roundingFunction = d3.format('.2f')
        for (let i = 0; i < keys.length; i++) {
          let faceValueCode = Number(keys[i])
          if (roundingFunction(d.data[faceValueCode]) === roundingFunction(blockValue)) {
            localFilter.faceValueCode = faceValueCode
            break
          }
        }
        that.renderBreadcrumb(breadcrumb, d.data.manufacturer, d.data.label, d3.select(this.parentNode).attr('class'))
      }

      function onMouseOut(d) {
        localFilter.manufacturerCode = null
        localFilter.faceValueCode = null
      }

      g = svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + parseInt(this.margin.top + this.breakcrumbHight) + ')')
      this.renderLegend(g, this.legendKeys, z)
    },

    renderBreadcrumb (breadcrumb, mfrname, period, key) {
      if( this.lock && this.lock.active ) {
        return
      }

      let title = ''
      let label = ''

      if (this.model && this.model.breadcrumbTitle) {
        title = this.model.breadcrumbTitle
        breadcrumb.text(title)
      }
      if (this.groupByField === 'facevaluePaperless') {
        breadcrumb.text('Face Value Redeemed')
      }
      else if (this.groupByField === 'facevalueunit') {
    	label = nch.services.filterService.getFaceValueLabel(Number(key))
        breadcrumb.text(title + ': ' + mfrname + ' > ' + period + ' > ' + nch.utils.addDollarSign(label))
      }
      else if (this.groupByField === 'facevalue') {
        label = nch.services.filterService.getFaceValueLabel(Number(key))
        breadcrumb.text(title + ': ' + mfrname + ' > ' + period + ' > ' + nch.utils.addDollarSign(label))
      } else {
        //breadcrumb.text( title + mfrname + ' \uf061 ' + period)
        breadcrumb.text(title + ': ' + mfrname + ' > ' + period)
      }
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
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    },

    renderLegend (g, keys, z) {
      const length = keys.length
      const groupBy = this.groupByField

      g.append('g')
        .append('text')
        .attr('x', 10)
        .attr('y', 0)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .text(this.labelField)

      const legend = g.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 14)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .selectAll('g')
        .data(keys.slice())  // NOTE: using a different data set here could simplify this some
        .enter().append('g')
        .attr('transform', function (d, i) {
          return 'translate(20,' + ( 40 * (length - i) - 20) + ')'
        })

      legend.append('circle')
        .attr('r', 15)
        .attr('cx', 0)
        .attr('cy', 20)
        .attr('fill', z)
        .attr('stroke', 'white')
        .attr('stroke-width', '3px')

      legend.append('text')
        .attr('x', 25)
        .attr('y', 20)
        .attr('dy', '0.32em')
        .text(function (d) {
          if (groupBy === 'facevalue' || groupBy === 'facevaluePaperless' || groupBy === 'facevalueunit') {
            let label = nch.services.filterService.getFaceValueLabel(Number(d))

            if (label === '1.00 +') {
              label = '1.01 +'
            }

            return nch.utils.addDollarSign(label)
          } else {
            return d
          }
        })

      legend.append('line')
        .attr('y1', 35)
        .attr('y2', 35)
        .attr('x1', 25)
        .attr('x2', 125)
        .attr('stroke', 'grey')
        .style('stroke-dasharray', '5, 5')
    },

    renderFaceValue (g, height, x, y, z, responseData, keys) {
      g.append('g')
        .selectAll('g')
        .data(responseData)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + i * 20 + ',' + 0 + ')'
        })
        .selectAll('g')
        .data(function (d) {
          return d
        })
        .enter().append('rect')
        .attr('x', function (d, i) {
          return x(d.manufacturer) + i * (x.bandwidth() / 2 + 15) + 90
        })
        .attr('y', 0)
        .attr('height', height - 50)
        .attr('width', x.bandwidth() / 2)
        .attr('fill', 'transparent')
        .attr('stroke', 'white')
        .attr('stroke-width', '5')
        .style('filter', 'url(#drop-shadow)')

      g.append('g')
        .selectAll('g')
        .data(responseData)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + i * 20 + ',' + 0 + ')'
        })
        .selectAll('g')
        .data(function (d) {
          return d
        })
        .enter().append('text')
        .attr('x', function (d, i) {
          return x.bandwidth() / 4 + x(d.manufacturer) + i * (x.bandwidth() / 2 + 15) + 90
        })
        .attr('y', height - 30)
        .attr('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .text(function (d) {
          return d.label
        })

      g.append('g')
        .selectAll('g')
        .data(responseData)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + i * 20 + ',' + 0 + ')'
        })
        .selectAll('g')
        .data(function (d) {
          return d3.stack().keys(keys)(d)
        })
        .enter().append('g')
        .attr('fill', function (d) {
          return z(d.key)
        })
        .selectAll('rect')
        .data(function (d) {
          return d
        })
        .enter().append('rect')
        .attr('x', function (d, i) {
          return x(d.data.manufacturer) + i * (x.bandwidth() / 2 + 15) + 90
        })
        .attr('y', function (d) {
          return y(d[1])
        })
        .attr('height', function (d) {
          return height - 50 - y(d[1] - d[0])
        })
        .attr('width', x.bandwidth() / 2)

      g.append('g')
        .selectAll('g')
        .data(responseData)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + i * 20 + ',' + 0 + ')'
        })
        .selectAll('g')
        .data(function (d) {
          return d3.stack().keys(keys)(d)
        })
        .enter().append('g')
        .selectAll('g')
        .data(function (d) {
          return d
        })
        .enter().append('text')
        .attr('x', function (d, i) {
          const manufacturerX = x(d.data.manufacturer)
          return x.bandwidth() / 4 + manufacturerX + i * (x.bandwidth() / 2 + 15) + 90
        })
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .attr('y', function (d) {
          return y(d[1] / 2 + d[0] / 2)
        })
        .text(function (d) {
          if ((d[1] - d[0]) / d.data.total > 0.005) {
            return d3.format('.1%')((d[1] - d[0]) / d.data.total)
          } else {
            return ''
          }
        })
      //.attr('fill', 'black') // Question... why is this here?

      g.append('g')
        .selectAll('g')
        .data(responseData)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + i * 20 + ',' + 0 + ')'
        })
        .selectAll('g')
        .data(function (d) {
          return d3.stack().keys(keys)(d)
        })
        .enter().append('g')
        .attr('class', function (d) {
          return d.key
        })
        .attr('fill', 'transparent')
        .selectAll('rect')
        .data(function (d) {
          return d
        })
        .enter().append('rect')
        .attr('class', 'faceValueBar')
        .attr('x', function (d, i) {
          return x(d.data.manufacturer) + i * (x.bandwidth() / 2 + 15) + 90
        })
        .attr('y', function (d) {
          return y(d[1])
        })
        .attr('height', function (d) {
          return height - 50 - y(d[1] - d[0])
        })
        .attr('width', x.bandwidth() / 2)

      g.append('g')
        .selectAll('text')
        .data(responseData)
        .enter().append('text')
        .attr('x', function (d, i) {
          return x.bandwidth() / 2 + x(d.mfrname) + i * 20 + 100
        })
        .attr('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .attr('y', height)
        .text(function (d) {
          return d.mfrname
        })
    },

    getFaceData () {
      const faceValueData = nch.services.dataService.getFaceValueData()
      return this.formatData(faceValueData)
    },

    getFaceRangeData () {
      const faceValueData = nch.services.dataService.getFaceValueRangeData()
      return this.formatData(faceValueData)
    },

    getPaperlessFaceData () {
      const faceValueData = nch.services.dataService.getPaperlessFaceValueData()
      return this.formatData(faceValueData)
    },

    formatData (faceValueData) {
      const result = []
      const manufacturerFaceKeys = Object.keys(faceValueData.manufacturer.data)
      const comparableFaceKeys = Object.keys(faceValueData.comparables.data)
      this.legendKeys = manufacturerFaceKeys.length > comparableFaceKeys.length ? manufacturerFaceKeys : comparableFaceKeys
      const manufacturerData = this.formatDataForManufacturer(faceValueData.manufacturer, this.model.manufacturer.code, this.legendKeys)
      result.push(manufacturerData)
      const comparableData = this.formatDataForManufacturer(faceValueData.comparables, 'ALL', this.legendKeys)
      result.push(comparableData)
      return result
    },

    formatDataForManufacturer (manufacturerData, manufacturerCode, keys) {
      let dataList = []
      dataList['mfrname'] = manufacturerData.label

      dataList[0] = {
        total: 100,
        label: nch.utils.getTimePeriodLabel(nch.model.period1),
        manufacturerCode: manufacturerCode,
        manufacturer: nch.utils.getManufacturerName(manufacturerCode),
        period: 1
      }

      for (let i = 0; i < keys.length; i++) {
        if (manufacturerData['data'][keys[i]] === undefined) {
          dataList[0][keys[i]] = 0
        } else {
          dataList[0][keys[i]] = manufacturerData['data'][keys[i]]['p1Percentage'] * 100
        }
      }

      dataList[1] = {
        total: 100,
        label: nch.utils.getTimePeriodLabel(nch.model.period2),
        manufacturerCode: manufacturerCode,
        manufacturer: nch.utils.getManufacturerName(manufacturerCode),
        period: 2
      }

      for (let j = 0; j < keys.length; j++) {
        if (manufacturerData['data'][keys[j]] === undefined) {
          dataList[1][keys[j]] = 0
        } else {
          if (isNaN(manufacturerData['data'][keys[j]]['p2Percentage']))
            dataList[1][keys[j]] = 0
          else
            dataList[1][keys[j]] = manufacturerData['data'][keys[j]]['p2Percentage'] * 100
        }
      }
      return dataList
    },

    formatFaceValueData(faceValueData) {
      var stackedData = []
      const manufacturerFaceKeys = Object.keys(faceValueData.manufacturer.data)
      const comparableFaceKeys = Object.keys(faceValueData.comparables.data)
      this.legendKeys = manufacturerFaceKeys.length > comparableFaceKeys.length ? manufacturerFaceKeys : comparableFaceKeys
      const manufacturerData = this.formatDataForManufacturer(faceValueData.manufacturer, this.model.manufacturer.code, this.legendKeys)
      stackedData.push(manufacturerData)
      const comparableData = this.formatDataForManufacturer(faceValueData.comparables, 'ALL', this.legendKeys)
      stackedData.push(comparableData)
      return stackedData

    }

  }
}
