import * as d3 from 'd3'
import services from 'src/modules/services'

export default {
  name: 'bipartite',
  template: require('components/charts/Bipartite.html'),
  data () {
    return {
      model: nch.model,
      manufacturerData: [],
      comparableData: []
    }
  },
  watch: {
    'model.selectedCategories': {
      handler: function () {
        this.loadStateData()
      }
    },
    'model.period1': {
      handler: function () {
        this.loadStateData()
      }
    }
  },
  mounted () {
    this.loadStateData()
  },

  methods: {

    loadStateData() {

      nch.services.dataService.loadStateByMediaData(this.model.manufacturer.code).then((response) => {
        var rawManufacturerData = response
        console.log("Raw manufacturer data count " + rawManufacturerData.length)
        this.manufacturerData = nch.services.filterService.processBipartiteData(rawManufacturerData)
        //console.log( this.manufacturerData )
        this.render()
      }).catch((message) => {
        console.log('Bipartite, loadStateByMediaData manufacturer promise catch:' + message)
        nch.model.alertMessage.push('Unable to load manufacturer Bipartite data')
        nch.model.showAlert = true
      })

      nch.services.dataService.loadStateByMediaData('ALL').then((response) => {
        var rawComparableData = response
        console.log("Raw comparable data count " + rawComparableData.length)
        this.comparableData = nch.services.filterService.processBipartiteData(rawComparableData)
        this.render()
      }).catch((message) => {
        console.log('Bipartite, loadStateByMediaData comparableData promise catch:' + message)
        nch.model.alertMessage.push('Unable to load comparableData Bipartite data')
        nch.model.showAlert = true
      })
    },

    render () {
      const color = this.model.colors.bipartitecolors

      if (this.manufacturerData.length === 0 || this.comparableData.length === 0) {
        console.log('**** Bipartite data has not completed loaded *****');
        return;
      }

      const svg = d3.select('#bipartiteGraph').attr('width', 1125).attr('height', 900).html('')

      svg.append('g')
        .attr('transform', 'translate(0,20)')
        .append('text')
        .attr('x', 50)
        .attr('y', 0)
        .attr('dy', '0.32em')
        .attr('fill', this.model.colors.breakcrumbColor)
        .attr('font-family', 'proxima_novaregular')
        .attr('font-size', '1.5em')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .text('Time Period: ' + nch.utils.getTimePeriodLabel(this.model.period2))

      svg.append('text').attr('x', 300).attr('y', 70)
        .attr('class', 'header').text(this.model.manufacturer.name)

      svg.append('text').attr('x', 875).attr('y', 70)
        .attr('class', 'header').text('Comparables')

      const g = [svg.append('g').attr('transform', 'translate(250,100)'), svg.append('g').attr('transform', 'translate(800,100)')]
      const chartHeight = 750

      const firstDataSet = viz.bP().data(this.manufacturerData).value(d => d[2]).height(chartHeight).width(200).barSize(35).sortPrimary(sort).fill(d => color[d.primary])
      const nextDataSet = viz.bP().data(this.comparableData).value(d => d[2]).height(chartHeight).width(200).barSize(35).sortPrimary(sort).fill(d => color[d.primary])

      const bp = [firstDataSet, nextDataSet];

      [0, 1].forEach(function (i) {
        g[i].call(bp[i])

        g[i].append('text').attr('x', -50).attr('y', -8).style('text-anchor', 'middle').text('Dimension')
        g[i].append('text').attr('x', 250).attr('y', -8).style('text-anchor', 'middle').text('State')

        g[i].append('line').attr('x1', -100).attr('x2', 0)
        g[i].append('line').attr('x1', 200).attr('x2', 300)

        g[i].append('line').attr('y1', 610).attr('y2', 610).attr('x1', -100).attr('x2', 0)
        g[i].append('line').attr('y1', 610).attr('y2', 610).attr('x1', 200).attr('x2', 300)

        g[i].selectAll('.mainBars')
          .on('mouseover', mouseover)
          .on('mouseout', mouseout)

        g[i].selectAll('.mainBars').append('text').attr('class', 'label')
          .attr('x', d => d.part === 'primary' ? -30 : 30)
          .attr('y', d => +6)
          .attr('font-size', '11px')
          .text(d => d.key)
          .attr('text-anchor', d => (d.part === 'primary' ? 'end' : 'start'))

        g[i].selectAll('.mainBars').append('text').attr('class', 'perc')
          .attr('x', d => (d.part === 'primary' ? -120 : 80))
          .attr('y', d => +6)
          .attr('font-size', '11px')
          .text(function (d) {
            return d3.format('.0%')(d.percent)
          })
          .attr('text-anchor', d => (d.part === 'primary' ? 'end' : 'start'))
      })

      function mouseover(d) {
        [0, 1].forEach(function (i) {
          bp[i].mouseover(d)

          g[i].selectAll('.mainBars').select('.perc')
            .text(function (d) {
              let percent = d3.format('.0%')(d.percent)
               if(percent === '0%') {
            	  percent = ''
               }
              return percent
            })
           g[i].selectAll('.mainBars').select('.label')
            .text(function (d) {
              let percent = d3.format('.0%')(d.percent)
              let label = d.key
               if(percent === '0%') {
            	   label =  ''
               }
              return label
            })
        })
      }

      function mouseout(d) {
        [0, 1].forEach(function (i) {
          bp[i].mouseout(d)
          g[i].selectAll('.mainBars').select('.perc')
            .text(function (d) {
              let percent = d3.format('.0%')(d.percent)
                if(percent === '0%') {
              	  percent = ''
                }
                return percent
            })
            
           g[i].selectAll('.mainBars').select('.label')
            .text(function (d) {
              let percent = d3.format('.0%')(d.percent)
              let label = d.key
               if(percent === '0%') {
            	   label =  ''
               }
              return label
            })
        })
      }

      function sort(a, b) {
        let sortValue = nch.constants.mediaTypeLabels
        return d3.ascending(sortValue.indexOf(a), sortValue.indexOf(b))
      }

      d3.select(self.frameElement).style('height', '920px')
    }
  }
}
