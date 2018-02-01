import * as d3 from 'd3'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'download',
  mixins: [ clickaway ],
  props: {
    pngEnabled: {
      type: String,
      default: 'false'
    },
    pdfEnabled: {
      type: String,
      default: 'false'
    },
    csvEnabled: {
      type: String,
      default: 'false'
    },
    svgElements: {
      type: Array,
      default: function() {
        return []
      }
    },
    csvData: {
      type: String
    },
    fileName: {
      type: String
    },
    title: {
      type: String
    }
  },
  template: require('components/layout/Download.html'),
  data () {
    return {
      model: nch.model,
      exportService: nch.services.exportService,
      showDownloadOptions: false
    }
  },
  methods: {
    csvClick: function() {
      let downloadData = []
      if (this.csvData === 'redemptionTable') {
        const manufacturerData = nch.services.dataService.getRedemptionData(this.model.manufacturer.code)
        const manufacturerCategoryData = nch.services.filterService.processRedemptionsByCategoryAndMediaType(manufacturerData)

        Object.values(manufacturerCategoryData).map(function(data) {
          const total1 = nch.utils.getTotalByMediaType(data, 1, manufacturerCategoryData)
          const total2 = nch.utils.getTotalByMediaType(data, 2, manufacturerCategoryData)
          downloadData.push({
            categoryname: data.categoryname,
            mediacodename: data.mediacodename,
            p1Value: total1 === 0 ? 0 : d3.format('.1%')(data.totalredemptionsp1 / total1),
            p2Value: total2 === 0 ? 0 : d3.format('.1%')(data.totalredemptionsp2 / total2),
            manufacturer: nch.model.manufacturer.name
          })
        })

        const comparableData = nch.services.dataService.getRedemptionData('ALL')
        const comparableCategoryData = nch.services.filterService.processRedemptionsByCategoryAndMediaType(comparableData)

        Object.values(comparableCategoryData).map(function(data) {
          const total1 = nch.utils.getTotalByMediaType(data, 1, comparableCategoryData)
          const total2 = nch.utils.getTotalByMediaType(data, 2, comparableCategoryData)
          downloadData.push({
            categoryname: data.categoryname,
            mediacodename: data.mediacodename,
            p1Value: total1 === 0 ? 0 : d3.format('.1%')(data.totalredemptionsp1 / total1),
            p2Value: total2 === 0 ? 0 : d3.format('.1%')(data.totalredemptionsp2 / total2),
            manufacturer: 'comparable'
          })
        })
      }else if (this.csvData === 'facevalue') {
        const faceValueData = nch.services.dataService.getFaceValueData()
        Object.values(faceValueData.manufacturer.data).map(function(value){
          downloadData.push(value)
        })
        Object.values(faceValueData.comparables.data).map(function(value){
          downloadData.push(value)
        })
      } else if (this.csvData === 'productmoved') {
        const code = this.model.manufacturer.code;
        const manufacturerProductMovedData = nch.services.dataService.getProductMovedForManufacturerData( code )
        const manufacturerPeriodData = nch.services.filterService.processProductMoved(manufacturerProductMovedData, code)
        const comparableProductMovedData = nch.services.dataService.getProductMovedForManufacturerData( 'ALL' )
        const comparablePeriodData = nch.services.filterService.processProductMoved(comparableProductMovedData, 'ALL')
        downloadData = [manufacturerPeriodData, comparablePeriodData]
      } else if (this.csvData === 'classOfTrade') {
        Object.values(nch.services.dataService.getRedemptionsByClassOfTrade(this.model.manufacturer.code)).map(function(value){
          value.manufacturer = nch.model.manufacturer.name
          downloadData.push(value)
        })
        Object.values(nch.services.dataService.getRedemptionsByClassOfTrade('ALL')).map(function(value){
          value.manufacturer = 'comparable'
          downloadData.push(value)
        })
      } else if (this.csvData === 'mediaType') {
        Object.values(nch.services.dataService.getRedemptionsByMedia(this.model.manufacturer.code)).map(function(value){
          value.manufacturer = nch.model.manufacturer.name
          downloadData.push(value)
        })
        Object.values(nch.services.dataService.getRedemptionsByMedia('ALL')).map(function(value){
          value.manufacturer = 'comparable'
          downloadData.push(value)
        })
      } else if (this.csvData === 'nielsenType') {
        Object.values(nch.services.dataService.getRedemptionsByMarket(this.model.manufacturer.code)).map(function(value){
          value.manufacturer = nch.model.manufacturer.name
          downloadData.push(value)
        })
        Object.values(nch.services.dataService.getRedemptionsByMarket('ALL')).map(function(value){
          value.manufacturer = 'comparable'
          downloadData.push(value)
        })
      }

      this.exportService.toCSV(this.fileName, downloadData)
    },
    pngClick: function() {
      let width = 0
      let height = 0
      let svgData = []
      let x = 0
      let y = 0
      for( let i = 0; i < this.svgElements.length; i++ ) {
        const svgElement = document.querySelector('#' + this.svgElements[i])
        let svgdata
        if (i < 2) {
          width += svgElement.parentNode.clientWidth
        }
        if (i % 2 === 0) {
          height += svgElement.parentNode.clientHeight
        }

        if(svgElement.querySelector('.lock')) {
          svgdata = svgElement.outerHTML.replace(svgElement.querySelector('.lock').outerHTML, '')
        } else {
          svgdata = svgElement.outerHTML
        }

        svgData.push({
          ele: svgdata,
          width: svgElement.parentNode.clientWidth,
          height: svgElement.parentNode.clientHeight,
          posX: x,
          posY: y
        })

        if (i % 2 === 0) {
          x += svgElement.parentNode.clientWidth
        } else {
          x = 0
          y += svgElement.parentNode.clientHeight
        }
      }

      this.exportService.toPNG(this.fileName, svgData, width, height)
    },
    pdfClick: function () {
      let width = 0
      let height = 0
      let svgData = []
      let x = 0
      for( let i = 0; i < this.svgElements.length; i++ ) {
        const svgElement = document.querySelector('#' + this.svgElements[i])
        let svgdata
        width += svgElement.clientWidth
        if( svgElement.clientHeight > height ) {
          height = svgElement.clientHeight
        }
        if(svgElement.querySelector('.lock')) {
          svgdata = svgElement.outerHTML.replace(svgElement.querySelector('.lock').outerHTML, '')
        } else {
          svgdata = svgElement.outerHTML
        }

        svgData.push({
          ele: svgdata,
          pos: x
        })
        x += svgElement.clientWidth;
      }

      nch.services.dataService.exportToPdf(svgData, this.title)
    },
    onAwayClick: function() {
      this.showDownloadOptions = false;
    },
    formatData ( manufacturerData, manufacturerCode, keys ) {
      var dataList = []
      dataList['mfrname'] = manufacturerData.label

      if( manufacturerData['data'][1] === undefined ) {
        return dataList;
      }

      dataList[0] = {
        total: 100,
        label: '2016 Q1', // TODO: should come from nch.model.firstPeriod
        manufacturerCode: manufacturerCode,
        manufacturer: nch.utils.getManufacturerName( manufacturerCode ),
        period: "PERIOD_CODE_HERE"
      }

      for( var i = 0; i < keys.length; i++ ) {
        dataList[0][keys[i]] = manufacturerData['data'][keys[i]]['p1Percentage'] * 100
      }

      dataList[1] = {
        total: 100,
        label: '2016 Q2', // TODO: should come from nch.model.secondPeriod
        manufacturerCode: manufacturerCode,
        manufacturer: nch.utils.getManufacturerName( manufacturerCode ),
        period: "PERIOD_CODE_HERE"
      }

      for( var j = 0; j < keys.length; j++ ) {
        dataList[1][keys[j]] = manufacturerData['data'][keys[j]]['p2Percentage'] * 100
      }

      return dataList;
    }
  }
}
