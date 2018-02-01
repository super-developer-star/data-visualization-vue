'use strict'
import * as http from 'superagent'

// local data
require('../data/us-states.json')
require('../data/manufacturers.json')
require('../data/redemption-data.json')
require('../data/pie-chart.json')
require('../data/sidebar-items.json')
require('../data/product-moved-pie.json')
require('../data/class-of-trades.json')
require('../data/segmentSectorSpecficManf.json')
require('../data/nielsentopo.json')
require('../data/help.json')
require('../data/systemNotifications.json')
require('../data/colors.json')

require('../data/redemption-all-with-state.json')
require('../data/redemption-manufacturer-with-state.json')
require('../data/redemption-all-with-state2.json')
require('../data/redemption-manufacturer-with-state2.json')

require('../data/redemption-all.json')
require('../data/redemption-manufacturer.json')

require('../data/product-moved-all.json')
require('../data/product-moved-manufacturer.json')
require('../data/product-moved-all-fv.json')
require('../data/product-moved-manufacturer-fv.json')

require('../data/nelisen705_2015_2016.json')
require('../data/nelisenALL_2015_2016.json')
require('../data/nelisenMedia705_2015_2016.json')
require('../data/nelisenMediaALL_2015_2016.json')

require('../data/dma705_2015_2016.json')
require('../data/dmaALL_2015_2016.json')
require('../data/dmaMedia705_2015_2016.json')
require('../data/dmaMediaALL_2015_2016.json')

require('../data/iri705_2015_2016.json')
require('../data/iriALL_2015_2016.json')
require('../data/iriMedia705_2015_2016.json')
require('../data/iriMediaALL_2015_2016.json')

require('../data/z-market-dma-all.json')
require('../data/z-market-dma-manufacturer.json')
require('../data/z-market-iri-all.json')
require('../data/z-market-iri-manufacturer.json')
require('../data/z-market-nielsen-all.json')
require('../data/z-market-nielsen-manufacturer.json')

require('../data/paperless-manufacturer.json')
require('../data/paperless-manufacturer-state.json')
require('../data/paperless-manufacturer-nielsen.json')
require('../data/paperless-manufacturer-iri.json')
require('../data/paperless-manufacturer-dma.json')

require('../data/period-data.json')
require('../data/state-redemptions-all.json')
require('../data/state-redemptions-manufacturer.json')

require('../data/login.json')
require('../data/PortalDates.json')

let services = {

  login: function() {
    var dataUrl = '/static/api/login.json'
    return this.loadRedemptionData( dataUrl )
  },

  notifications: function() {
    var dataUrl = '/static/api/systemNotifications.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadPaperlessGeo: function( suffix ) {
    console.log("Loading Paperless Geo data for " + suffix)
    var dataUrl = '/static/api/paperless-manufacturer-' + suffix + '.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadManufacturerData: function() {
    console.log("Loading Manufacturer data")
    var dataUrl = '/static/api/redemption-manufacturer.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadComparableData: function() {
    console.log("Loading Comparable data")
    var dataUrl = '/static/api/redemption-all.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadManufacturerMarketData: function() {
    console.log("Loading Manufacturer data")
    var dataUrl = '/static/api/nelisen705_2015_2016.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadComparableMarketData: function() {
    console.log("Loading Comparable data")
    var dataUrl = '/static/api/nelisenALL_2015_2016.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadManufacturerMarketMediaData: function() {
    console.log("Loading Manufacturer Media data")
    var dataUrl = '/static/api/nelisenMedia705_2015_2016.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadComparableMarketMediaData: function() {
    console.log("Loading Comparable Media data")
    var dataUrl = '/static/api/nelisenMediaALL_2015_2016.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadProductMovedManufacturerData: function() {
    console.log("Loading ProductMoved Manufacturer data")
    var dataUrl = '/static/api/product-moved-manufacturer.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadProductMovedComparableData: function() {
    console.log("Loading ProductMoved Comparable data")
    var dataUrl = '/static/api/product-moved-all.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadBipartiteManufacturerData: function() {
    console.log("Loading Manufacturer data")
    var dataUrl = '/static/api/redemption-manufacturer-with-state2.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadBipartiteComparableData: function() {
    console.log("Loading Comparable data")
    var dataUrl = '/static/api/redemption-all-with-state2.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadSectorsData: function () {
    console.log('Loading Sector data')
    const dataUrl = '/static/api/segmentSectorSpecficManf.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadRemoteSectorsData: function () {
    console.log('Loading Sector data')
    const dataUrl = '/crunch/categories?manufacturer=' + nch.model.manufacturer.code
    return this.loadRedemptionData( dataUrl )
  },

  loadTimePeriodData: function() {
    console.log('Loading Time Period data')
    const dataUrl = '/static/api/period-data.json'
    return this.loadRedemptionData(dataUrl)
  },

  loadRemoteTimePeriodData: function() {
    console.log('Loading Remote Time Period data')
    const dataUrl = '/crunch/timeperiods?manufacturer=' + nch.model.manufacturer.code
    return this.loadRedemptionData(dataUrl)
  },

  loadStateRedemptionsAllData: function() {
    const dataUrl = '/static/api/state-redemptions-all.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadStateRedemptionsManufacturerData: function() {
    const dataUrl = '/static/api/state-redemptions-manufacturer.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadPaperlessManufacturerData: function() {
    const dataUrl = '/static/api/paperless-manufacturer.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadPaperlessComparableData: function() {
    const dataUrl = '/static/api/paperless-manufacturer.json'
    return this.loadRedemptionData( dataUrl )
  },

  loadRedemptionData: function(dataUrl) {
    nch.utils.startLoadingService(dataUrl)
    return new Promise((resolve, reject) => {
      http
        .get(dataUrl)
        .end(function(error, response) {
          nch.utils.endLoadingService(dataUrl)
          if (response.status === 200) {
            const json = JSON.parse(response.text)
            resolve(json)
          } else if (response.status === 401) {
            console.log('user not authorized')
            reject(response)
          } else if (response.status === 500) {
            console.log('Server Error')
            reject(response)
          } else if (response.status === 404) {
            console.log('Resource not found')
            reject(response)
          }
        })
    })
  },

  loadSidebarItems: function () {
    nch.utils.startLoadingService('loadSidebarItems')
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/sidebar-items.json')
        .end(function(error, response) {
          nch.utils.endLoadingService('loadSidebarItems')
          if (response.status === 200) {
            const sidebarItems = JSON.parse(response.text)
            resolve(sidebarItems['_items'])
          } else if (response.status === 401) {
            console.log('user not authorized')
          }
        })
    })
  },

  loadHelpItems: function() {
    nch.utils.startLoadingService('loadHelpItems')
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/help.json')
        .end(function(error, response) {
          nch.utils.endLoadingService('loadHelpItems')
          if (response.status === 200) {
            const helpItems = JSON.parse(response.text)
            resolve(helpItems['sections'])
          } else if (response.status === 401) {
            console.log('user not authorized')
          }
        })
    })
  },

  loadNielsenTopology: function() {
    nch.utils.startLoadingService('loadNielsenTopology')
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/nielsentopo.json')
        .end(function(error, response) {
          nch.utils.endLoadingService('loadNielsenTopology')
          if (response.status == 200) {
            var json = JSON.parse(response.text)
            resolve(json)
          }
          else if (response.status == 401) {
            console.log('user not authorized')
          }
        })
    })
  },

  loadColors: function() {
    console.log("Loading Colors")
    var dataUrl = '/static/api/colors.json'
    http
      .get( dataUrl )
      .end(function(error, response) {
        if (response.status === 200) {
          const colors = JSON.parse(response.text)
          nch.model.colors = colors
          nch.model.colors.breakcrumbColor = '#498fe1'
        } else if (response.status === 401) {
          console.log('user not authorized')
        }
      })

  },

  loadWeekData: function() {
    console.log("Loading Week metadata")
    var dataUrl = '/static/api/PortalDates.json'
    http
      .get( dataUrl )
      .end(function(error, response) {
        if (response.status === 200) {
          const weekData = JSON.parse(response.text)
          console.log( "Weeks loaded, count: " + weekData.length )
          nch.model.weekData = weekData
        } else if (response.status === 401) {
          console.log('user not authorized')
        }
      })
  },

  getRedemptionsByMedia: function() {
    nch.utils.startLoadingService('getRedemptionsByMedia')
    return new Promise((resolve, reject) => {
      http
        .get('/static/api/pie-chart.json')
        .end(function(error, response) {
          nch.utils.endLoadingService('getRedemptionsByMedia')
          if (response.status === 200) {
            const redemptionData = JSON.parse(response.text)
            const items = redemptionData['_items']
            resolve(items)
          } else if (response.status === 401) {
            console.log('user not authorized')
            reject('user not authorized')
          }
        })
    })
  },

  loadMarketData( manufacturer, marketType ) {
    var dataUrl = ''

    if( manufacturer === 'ALL' || manufacturer === 'Comparables' ) {
      if( marketType === 'iri' ) {
        dataUrl = '/static/api/iriALL_2015_2016.json'
      }
      else if( marketType === 'dma' ) {
        dataUrl = '/static/api/dmaALL_2015_2016.json'
      }
      else {
        dataUrl = '/static/api/nelisenALL_2015_2016.json'
      }
    }
    else {
      if( marketType === 'iri' ) {
        dataUrl = '/static/api/iri705_2015_2016.json'
      }
      else if( marketType === 'dma' ) {
        dataUrl = '/static/api/dma705_2015_2016.json'
      }
      else {
        dataUrl = '/static/api/nelisen705_2015_2016.json'
      }
    }

    return this.loadRedemptionData( dataUrl )
  },

  loadMarketDataByMedia( manufacturer, marketType ) {
    var dataUrl = ''

    if( manufacturer === 'ALL' || manufacturer === 'Comparables' ) {
      if( marketType === 'iri' ) {
        dataUrl = '/static/api/z-market-iri-all.json'
      }
      else if( marketType === 'dma' ) {
        dataUrl = '/static/api/z-market-dma-all.json'
      }
      else {
        dataUrl = '/static/api/z-market-nielsen-all.json'
      }
    }
    else {
      if( marketType === 'iri' ) {
        dataUrl = '/static/api/z-market-iri-manufacturer.json'
      }
      else if( marketType === 'dma' ) {
        dataUrl = '/static/api/z-market-dma-manufacturer.json'
      }
      else {
        dataUrl = '/static/api/z-market-nielsen-manufacturer.json'
      }
    }

    return this.loadRedemptionData( dataUrl )
  },

  exportToPdf( svgList, title ) {
    var formData = new FormData();
    formData.append('report', title)
    formData.append('manufacturer', nch.model.manufacturer.code)

    for( let i = 0; i < svgList.length; i++ ) {
      var svgData = svgList[i]
      formData.append('svg', svgData.ele)
    }

    var segmentName = nch.model.selectedSegmentCode === 1 ? 'Food' : 'Non-Food'
    formData.append('segment', segmentName)

    // selected sector had been removed, pull this from the first selected category
    if (nch.model.selectedCategories.length > 0) {
      var category = nch.model.selectedCategories[0]
      formData.append('sector', category.sectorname)
    }

    http.post('/static/api/pdf')
      .send(formData)
      .set('x-api-token', this.authToken)
      .set('Accept', 'application/json')
      .end(function (error, response) {
        console.log(response)
      })
  }
}

module.exports = services
