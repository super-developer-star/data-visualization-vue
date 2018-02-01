import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/views/Dashboard'
import FaceValue from '../components/views/FaceValue'
import ProductMoved from '../components/views/ProductMoved'
import BilateralData from '../components/views/BilateralData'
import Media from '../components/views/Media'
import Geographic from '../components/views/Geographic'
import Help from '../components/views/Help'
import Settings from '../components/views/Settings'
import ClassOfTrade from '../components/views/ClassOfTrade'
import Paperless from '../components/views/Paperless'
import RedemptionTrends from '../components/views/RedemptionTrends'
import Privacy from '../components/views/Privacy'
import Terms from '../components/views/Terms'
import Notifications from '../components/views/Notifications'

import Home from '../Home'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/face-value/:view',
      name: 'FaceValue',
      component: FaceValue,
      props: true
    },
    {
      path: '/product-moved',
      name: 'ProductMoved',
      component: ProductMoved
    },
    {
      path: '/bilateral-data',
      name: 'BilateralData',
      component: BilateralData
    },
    {
      path: '/media',
      name: 'Media',
      component: Media
    },
    {
      path: '/geographic/:view',
      name: 'Geographic',
      component: Geographic,
      props: true
    },
    {
      path: '/paperless/:view',
      name: 'Paperless',
      component: Paperless,
      props: true
    },
    {
      path: '/class-of-trade',
      name: 'ClassOfTrade',
      component: ClassOfTrade
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/logout',
      name: 'logout'
    },
    {
      path: '/help',
      name: 'Help',
      component: Help
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/redemption-trends',
      name: 'RedemptionTrends',
      component: RedemptionTrends
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: Privacy
    },
    {
        path: '/terms',
        name: 'Terms',
        component: Terms
     },
    {
        path: '/notifications',
        name: 'Notifications',
        component: Notifications
     }
  ]
})


router.beforeEach((to, from, next) => {
 nch.utils.trackPageViews( to.fullPath )
 if( to.name === 'logout') {
    nch.services.userService.logout()
    next({
      name: 'Home'
    })
  } else if( nch.model.loginData !== null || to.name === 'Home' ) {
    next()
  }
  else {
    next({
      name: 'Home'
    })

    next()
  }
})

export default router
