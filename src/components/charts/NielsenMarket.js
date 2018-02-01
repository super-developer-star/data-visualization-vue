import * as d3 from 'd3'

import services from '../../modules/services'

export default {
  name: 'nielsen-market',
  props: {
    title: {
      type: String,
      default: ''
    },
    geoId: {
      type: String,
      default: ''
    },
    manufacturerCode: {},
    lock: {},
    filterObject: {},
    marketType: {
      type: String,
      default: ''
    },
    showBreadcrumb: {
      type: Boolean,
      default: false
    },
    isPaperless: {
      type: Boolean,
      default: false
    }
  },
  template: require('components/charts/NielsenMarket.html'),
  data () {
    return {
      model: nch.model,
      nielsenTopology: null,
      marketData: null,
      usStatesMapData: null,
      margin: {
        top: 20,
        right: 0,
        bottom: 20,
        left: 0
      },
      breakcrumbHight: 50
    }
  },
  watch: {
    marketType: {
      handler: function (newValue, oldValue) {
        this.loadMarketData()
      }
    },
    'model.selectedCategories': {
      handler: function () {
        this.loadMarketData()
      }
    },
    'model.period1': {
      handler: function () {
        this.loadMarketData()
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  mounted () {

    this.loadMarketData()
    services.loadNielsenTopology().then((response) => {
      this.nielsenTopology = response
      this.render()
    }).catch((message) => {
      console.log('NielsenMarket, loadNielsenTopology promise catch:' + message)
      nch.model.alertMessage.push('Unable to load Nielsen Topology data')
      nch.model.showAlert = true
    })

    d3.json("/static/api/us-states.json", (json) => {
      this.usStatesMapData = json.features
      this.render()
    })

    this.render();
    window.addEventListener('resize', this.handleWindowResize)
  },
  methods: {
    loadMarketData () {
      if (this.model.selectedCategories == null || this.model.selectedCategories.length === 0) {
        console.log('Cannot load market data without any selected categories')
        return;
      }

      var promise = null;

      if( this.isPaperless ) {
        promise = nch.services.dataService.loadPaperlessMarketData(this.manufacturerCode, this.marketType)
      }
      else {
        promise = nch.services.dataService.loadMarketData(this.manufacturerCode, this.marketType)
      }

      promise.then((response) => {
        this.marketData = nch.services.filterService.processMarketData(response)

        if( this.isPaperless ) {
          nch.services.marketService.setPaperlessGeoData(this.manufacturerCode, this.marketType, this.marketData )
        }
        else {
          nch.services.marketService.setGeoData(this.manufacturerCode, this.marketType, this.marketData)
        }

        this.render()
      }).catch((message) => {
        console.log('NielsenMarket, loadMarketData promise catch:' + message)
        // nch.model.alertMessage.push('Unable to load Nielsen Market data')
        // nch.model.showAlert = true
      })

    },
    mapMarketData () {
      this.marketData.map( (market) => {
        this.nielsenTopology.objects.nielsen_dma.geometries.forEach( (nielsen) => {
          if (this.marketType === 'nielsen' && nielsen.acn && parseInt(market.id) === parseInt(nielsen.acn)) {
            market.lat = nielsen.properties.latitude
            market.lon = nielsen.properties.longitude
            return true
          } else if (this.marketType === 'iri' && nielsen.iri && parseInt(market.id) === parseInt(nielsen.iri)) {
            market.lat = nielsen.properties.latitude
            market.lon = nielsen.properties.longitude
            return true
          } else if (this.marketType === 'dma' && nielsen.id && parseInt(market.id) === parseInt(nielsen.id)) {
            market.lat = nielsen.properties.latitude
            market.lon = nielsen.properties.longitude
            return true
          }
        })
      })
    },
    handleWindowResize() {
      this.render()
    },
    render () {
      const svg = d3.select('#' + this.geoId).html('')
      if (this.marketData === null || this.marketData.length === 0 || this.nielsenTopology === null || this.usStatesMapData === null) {
        return
      }
      let tooltip

      if (d3.select('.tooltip').node() === null) {
        tooltip = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0)
      } else {
        tooltip = d3.select('.tooltip')
          .style('opacity', 0)
      }

      this.mapMarketData()

      svg.attr('width', d3.select('#' + this.geoId).node().parentNode.clientWidth)
      const width = +svg.attr('width') - this.margin.left - this.margin.right
      const height = width * 0.5 + this.margin.top + this.margin.bottom + this.breakcrumbHight

      const projection = d3.geoAlbersUsa().scale(width).translate([width / 2, height / 2])
      const path = d3.geoPath().projection(projection)

      const g = d3.select('#' + this.geoId)
        .attr("width", parseInt(width) + this.margin.left + this.margin.right)
        .attr("height", parseInt(height))

      const breadcrumb = g.append('g')
        .attr('transform', 'translate(' + 0 + ',' + this.margin.top + ')')
        .append('text')
        .attr('x', 10)
        .attr('y', 0)
        .attr('dy', '0.32em')
        .attr('fill', this.model.colors.breakcrumbColor)
        //.attr('font-family', 'FontAwesome')
        .attr('font-family', 'proxima_novaregular')
        .attr('font-size', '1.5em')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')

      if (this.showBreadcrumb) {
        var marketTypeLabel = nch.utils.getMarketLabel(this.marketType)
        //breadcrumb.text('\uF200 ' + marketTypeLabel + ' Market and Media Mfr. vs. Comparables')
        var breadcrumbLabel = this.isPaperless ? marketTypeLabel + ' Market' : marketTypeLabel + ' Market and Media'
        breadcrumb.text(breadcrumbLabel)
        breadcrumb.call(this.wrap, width - 50);
      }

      const component = this
      g.append('g')
        .attr('transform', 'translate(' + 0 + ',' + this.breakcrumbHight + ')')
        .selectAll("path")
        .data(component.usStatesMapData)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", "#aaa")

      g.append('g')
        .attr('transform', 'translate(' + 0 + ',' + this.breakcrumbHight + ')')
        .selectAll()
        .data(component.marketData)
        .enter()
        .append('text')
        .text(function (d) {
          if (d.lon && d.lat)
            return '\uf041'
        })
        .attr('class', 'fa fa-map-marker')
        .style('font-size', '20px')
        .style('fill', '#498fe1')
        .style('cursor', 'pointer')
        .attr("transform", function (d) {
          if (d.lon && d.lat)
            return "translate(" + projection([d.lon, d.lat]) + ")"
        })
        .on('mouseover', function(d) {
          if( component.filterObject ) {
            component.filterObject.marketCode = d.id
          }

          d3.select(this).style('fill', '#ff0000')
          tooltip.transition().duration(200).style('opacity', '.95')
          tooltip.html(component.renderToolTip(d))
          tooltip.style('left', (d3.event.pageX - 20) + 'px').style('top', (d3.event.pageY - 135) + 'px')

          if (component.showBreadcrumb) {
            component.renderBreadcrumb(breadcrumb, component.title, d.name)
          }

        })
        .on('mouseout', function(d) {
          if( component.filterObject ) {
            component.filterObject.marketCode = null
          }

          d3.select(this).style('fill', '#498fe1')
          tooltip.transition().duration(500).style('opacity', 0)

          if (component.showBreadcrumb) {
            var marketTypeLabel = nch.utils.getMarketLabel(component.marketType)
            //breadcrumb.text('\uf200 ' + marketTypeLabel + ' Market and Media Mfr. vs. Comparables')
            //breadcrumb.text(marketTypeLabel + ' Market and Media Mfr. vs. Comparables')
            var breadcrumbLabel = this.isPaperless ? marketTypeLabel + ' Market' : marketTypeLabel + ' Market and Media'
            breadcrumb.text(breadcrumbLabel)
            breadcrumb.call(component.wrap, width - 50);
          }
        })
        .on('click', () => {
          if( this.lock ) {
            this.lock.active = true
          }
        })
    }, // end render

    renderBreadcrumb (breadcrumb, mfrname, period) {
      const width = d3.select('#' + this.geoId).node().parentNode.clientWidth - this.margin.left - this.margin.right
      var marketTypeLabel = nch.utils.getMarketLabel(this.marketType)
      //breadcrumb.text('\uf200 ' + marketTypeLabel + ' Market and Media Mfr. vs. Comparables: ' + mfrname + ' \uf061 ' + period)
      //breadcrumb.text(marketTypeLabel + ' Market and Media Mfr. vs. Comparables: ' + mfrname + ' > ' + period)
      var breadcrumbLabel = this.isPaperless ? marketTypeLabel + ' Market' : marketTypeLabel + ' Market and Media'
      breadcrumb.text(breadcrumbLabel)
      breadcrumb.call(this.wrap, width - 50);
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

    renderToolTip(marketDataItem) {
      const nielsenName = marketDataItem.name
      // const period1 = nch.utils.getTimePeriodLabel(this.model.period1)
      // const period2 = nch.utils.getTimePeriodLabel(this.model.period2)
      var rawOtherMarketData = null

      if( this.isPaperless ) {
        rawOtherMarketData = nch.services.dataService.getOtherPaperlessMarketData(this.title, marketDataItem, this.marketType)
      }
      else {
        rawOtherMarketData = nch.services.dataService.getOtherMarketData(this.title, marketDataItem, this.marketType)
      }

      var tempData = nch.services.filterService.processMarketData(rawOtherMarketData);
      const otherMarketData = tempData[0]

      // const m1 = this.title !== 'Comparables' ? marketDataItem.marketratiop1 : otherMarketData.marketratiop1
      // const m2 = this.title !== 'Comparables' ? marketDataItem.marketratiop2 : otherMarketData.marketratiop2
      //
      // var comp1 = 0
      // var comp2 = 0
      //
      // // data can sometimes be undefined
      // try {
      //   comp1 = this.title === 'Comparables' ? marketDataItem.marketratiop1 : otherMarketData.marketratiop1
      // }
      // catch (error) {
      // }
      //
      // try {
      //   comp2 = this.title === 'Comparables' ? marketDataItem.marketratiop2 : otherMarketData.marketratiop2
      // } catch (error) {
      // }

      // data can be undefined if corresponding data does not exist
      var marketchangeValue = 0

      try {
        marketchangeValue = this.title !== 'Comparables' ? marketDataItem.marketchange : otherMarketData.marketchange
        marketchangeValue = Math.round( marketchangeValue ) + '%'
      }
      catch (error) {
        marketchangeValue = '--'
      }

      var marketchangeComparableValue = 0

      // data can sometimes be undefined
      try {
        marketchangeComparableValue = this.title === 'Comparables' ? marketDataItem.marketchange : otherMarketData.marketchange
        marketchangeComparableValue = Math.round( marketchangeComparableValue ) + '%'
      }
      catch (error) {
        marketchangeComparableValue = '--'
      }

      // % Change In Redemption Period Over Period by <<Market Name>>

      const tableHtml = '<p>' + nielsenName + '</p>' +
        '<p>% Change In Redemption Period Over Period</p>' +
        '<table class="table table-condensed">' +
        '<tbody>' +
        '<tr>' +
        '<td>MFR</td>' +
        '<td class="value">' + marketchangeValue + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>COMP</td>' +
        '<td class="value">' + marketchangeComparableValue + '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>'
      return tableHtml
    }
  }
}
