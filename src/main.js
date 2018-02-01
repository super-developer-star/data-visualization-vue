// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ServiceFactory from './components/services/ServiceFactory'
require('imports-loader?d3=d3!./vendor/viz.js')

import services from 'src/modules/services'

Vue.config.productionTip = false

const nch = require('./modules/config')
window.nch = nch
const utils = require('./modules/utils')
nch.utils = utils
const constants = require('./modules/constants')
nch.constants = constants
nch.eventDispatcher = new Vue()

import router from './modules/router'
nch.router = router
nch.model.showTerms = false;

if (process.env.NODE_ENV === 'development') {
  nch.model.period1 = {type: 'quarter', code: 201601, year: 2016, quarter: 1}
  nch.model.period2 = {type: 'quarter', code: 201701, year: 2017, quarter: 1}

  nch.model.selectedSector = {
    segmentcode: 1,
    sectorcode: 2,
    sectorname: "Dry Grocery"
  }
}

if( nch.utils.isDevelopment() ) {
  nch.model.timePeriods.push({ id: 'ytd', label: 'Year To Date' })
  nch.model.timePeriods.push({ id: 'weekly-range', label: 'Weekly Range' })
}

services.loadColors()
services.loadWeekData()
const serviceFactory = new ServiceFactory()
nch.services.userService = serviceFactory.getUserService()
nch.eventDispatcher.$on('loginSuccessful', initServices)

nch.eventDispatcher.$on('unauthorizedRequest', () => {
  // nch.router.push({ name: 'Home' })
  // nch.model.alertMessage.push('Session expired.  Please log in again.')
  // nch.model.showAlert = true
  window.location.reload(true); // need to reload the app to cleanup, then authenticate
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

function initServices() {
  nch.services.cacheService = serviceFactory.getCacheService()
  nch.services.marketService = serviceFactory.getMarketService()
  nch.services.timePeriodService = serviceFactory.getTimePeriodService()
  nch.services.filterService = serviceFactory.getFilterService()
  nch.services.sectorCategoryService = serviceFactory.getSectorCategoryService()
  nch.services.exportService = serviceFactory.getExportService()
  nch.services.dataService = serviceFactory.getDataService()
  nch.eventDispatcher.$off('loginSuccessful', initServices)
}
