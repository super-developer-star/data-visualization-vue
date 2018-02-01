import * as d3 from 'd3'

export default {
  name: 'geo',
  props: {
    title: {
      type: String,
      default: ''
    },
    geoId: {
      type: String,
      default: ''
    },
    isPaperless: {
      type: Boolean,
      default: false
    }
  },
  template: require('components/charts/Geo.html'),
  data () {
    return {
      model: nch.model,
      quantile: null,
      rateById: null,
      projection: null,
      path: null,
      stateData: null,
      margin: {
        top: 20,
        right: 0,
        bottom: 20,
        left: 0
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  watch: {
    'model.selectedCategories': {
      handler: function () {
        this.stateData = null  // reset data
        this.loadData()
      }
    },
    'model.period1': {
      handler: function () {
        this.stateData = null  // reset data
        this.loadData()
      }
    }
  },
  mounted () {
    if( this.stateData !== null ) {
      this.render();
      return;
    }

    this.loadData();
    this.render();
    window.addEventListener('resize', this.handleWindowResize)
  },
  methods: {
    handleWindowResize() {
      this.render()
    },
    loadData() {
      var manufacturerCode = this.title === 'Comparables' ? 'ALL' : this.model.manufacturer.code
      var promise = null;

      if( this.isPaperless ) {
        promise = nch.services.dataService.loadPaperlessStateData(manufacturerCode)
      }
      else {
        promise = nch.services.dataService.loadStateData(manufacturerCode)
      }

      promise.then( (response) => {
        this.stateData = nch.services.filterService.filterStateData( response );
        this.render();
      }).catch( (message) => {
        console.log('Geo, loadStateData promise catch:' + message)
      })
    },
    render () {
      if( this.stateData === null ) {
        return;
      }

      const stateMap = this.stateData.states
      const section = this.stateData.max / 4

      // Append Div for tooltip to SVG
      var component = this;

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

      // const svg = d3.select('#' + this.geoId).html('')
      // svg.attr('width', d3.select('#' + this.geoId).node().parentNode.clientWidth)

      document.getElementById( this.geoId + 'Container' ).innerHTML = "";
      var selector = '#' + this.geoId + 'Container'
      var svg = d3.select( selector ).append( "svg" )
        .attr( "width", 600 )
        .attr( "height", 400 )
        .attr( "id", this.geoId )
        .attr( "xmlns", "http://www.w3.org/2000/svg" )

      var chartWidth = 400

      try {
        var chartNode = d3.select('#' + this.geoId).node()
        chartWidth = chartNode.parentNode.clientWidth
      }
      catch( error ) {
        console.log('Geo error')
        console.log(error)
      }

      svg.attr('width', chartWidth)

      const width = +svg.attr('width') - this.margin.left - this.margin.right
      const height = width * 0.5 + this.margin.top + this.margin.bottom
      svg.attr("height", parseInt(height))

      const projection = d3.geoAlbersUsa()
      projection.scale(width).translate([width / 2, height / 2])
      const path = d3.geoPath().projection(projection)
      const colorValues = this.model.colors.geocolors
      const color = d3.scaleLinear().range(colorValues)
      const states = Object.keys(stateMap)
      color.domain([0, 1, 2, 3]) // setting the range of the input data

      // Load GeoJSON data and merge with states data
      d3.json('/static/api/us-states.json', function (json) {
        for (let i = 0; i < states.length; i++) {
          const stateAbbrev = states[i]
          const stateName = nch.utils.getStateName(stateAbbrev)
          const stateInfo = stateMap[stateAbbrev]

          // Find the corresponding state inside the GeoJSON
          for (let j = 0; j < json.features.length; j++) {
            const jsonState = json.features[j].properties.name
            if (stateName === jsonState) {
              json.features[j].properties.stateData = stateInfo
              json.features[j].properties.redemptions = stateInfo.redemptions
              json.features[j].properties.visited = 3
              if (stateInfo.redemptions < section) {
                json.features[j].properties.visited = 0
              } else if (stateInfo.redemptions < (section * 2)) {
                json.features[j].properties.visited = 1
              } else if (stateInfo.redemptions < (section * 3)) {
                json.features[j].properties.visited = 2
              }
              break
            }
          }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style('stroke', '#fff')
          .style('stroke-width', '1')
          .style('fill', function (d) {
            // Get data value
            const value = d.properties.visited
            if (value) {
              // If value exists…
              return color(value)
            } else {
              // If value is undefined…
              return '#d4d4d4' // default
            }
          })
          .on('mouseover', function (d) {
            tooltip.transition()
              .duration(200)
              .style('opacity', '.95')
            //div.text(d.properties.name + '\n(' + d.properties.redemptions + ')')
            tooltip.html(component.renderToolTip( d.properties.stateData ))
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY - 28) + 'px')
          })

          // fade out tooltip on mouse out
          .on('mouseout', function (d) {
            tooltip.transition()
              .duration(500)
              .style('opacity', 0)
          })
      })
    }, // end render

    renderToolTip( stateData ) {
      var state = stateData.name
      var otherManufacturerStateData = null;

      if( this.isPaperless ) {
        otherManufacturerStateData = nch.services.dataService.getOtherPaperlessStateData(this.title, state)
      }
      else {
        otherManufacturerStateData = nch.services.dataService.getOtherStateData(this.title, state)
      }

      var m1 = this.title !== 'Comparables' ? stateData.stateChange : otherManufacturerStateData.stateChange;

      var otherM1 = this.title !== 'Comparables' ? otherManufacturerStateData.stateChange : stateData.stateChange;


      var tableHtml = '<table class="table table-condensed"> ' +
        '<thead> ' +
        '<tr> ' +
        '<th>' + state + '</th> ' +
        '<th></th> ' +
        '</tr> ' +
        '</thead> ' +
        '<tbody> ' +
        '<tr> ' +
        '<td>MFR</td> ' +
        '<td>' + Math.round( m1 ) + '%</td>' +
        '</tr>  ' +
        '<tr> ' +
        '<td>COMP</td> ' +
        '<td>' + Math.round( otherM1 ) + '%</td>' +
        '</tr>  ' +
        '</tbody> </table>'
      return tableHtml;
    }
  }
}
