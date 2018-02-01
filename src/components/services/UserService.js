import * as http from 'superagent'
import services from '../../modules/services'

export default class UserService {

  // ***** PUBLIC APIS ********************************************************

  login(user) {
    if (process.env.NODE_ENV === 'development') {
      return this.localLogin(user)
    } else {
      return this.remoteLogin(user)
    }
  }

  logout() {
    nch.services.cacheService.clearCache()
    nch.model.loggingin = false
    if (process.env.NODE_ENV === 'development') {
      return this.localLogout()
    } else {
      return this.remoteLogout()
    }
  }

  terms( version ) {
    if (process.env.NODE_ENV === 'development') {
      return this.localTerms(version)
    } else {
      return this.remoteTerms(version)
    }
  }

  notifications() {
    if (process.env.NODE_ENV === 'development') {
      return this.localNotifications()
    } else {
      return this.remoteNotifications()
    }
  }

  // ***** NOTIFICATIONS ******************************************************

  localNotifications() {
    return services.notifications()
  }

  remoteNotifications() {
    var dataUrl = '/crunch/notifications?secappid=' + nch.model.loginData.SecAppId + '&secuserid=' + nch.model.loginData.SecUserId
    return this.executeRequest(dataUrl)
  }

  // ***** TERMS **************************************************************

  localTerms(version) {
    return new Promise((resolve, reject) => {
      // TODO: need some better local data
      var response = {
        "SecAppId": 9,
        "SecUserId": 0,
        "Version": 0,
        "Terms": "token"
      }
      resolve(response)
    })
  }

  remoteTerms(version) {
    var dataUrl = '/crunch/acknowledgement?version=' + version + '&secuserid=' + nch.model.loginData.SecUserId + '&accepted=true'
    return this.executeRequest(dataUrl)
  }

  // ***** LOGIN **************************************************************

  localLogin(user) {
    nch.model.loggingin = false
    return services.login()
  }

  remoteLogin(user) {
    var dataUrl = '/crunch/login'

    var requsetData = {
      id: user.name,
      password: user.password
    }

    return new Promise((resolve, reject) => {
      http.post(dataUrl)
        .send(requsetData)
        .end(function (error, response) {
          nch.model.loggingin = false

          if (response.status === 200) {
            const json = JSON.parse(response.text)
            nch.model.loginData = json
            resolve(json)
          }
          else {
            reject(response)
          }
        })
    })
  }

  // ***** LOGOUT *************************************************************

  localLogout() {
    return new Promise((resolve, reject) => {
      nch.model.loginData = null
      resolve(null)
    })
  }

  remoteLogout() {

    var dataUrl = '/crunch/logout'

    var requsetData = {
      id: nch.model.loginData.UserId,
      token: nch.model.loginData.LoginResultId
    }

    return new Promise((resolve, reject) => {
      http.post(dataUrl)
        .send(requsetData)
        .end(function (error, response) {

          if (response.status === 200) {
            const json = JSON.parse(response.text)
            nch.model.loginData = null
            resolve(json)
          }
          else {
            reject(response)
          }
        })
    })
  }

  // ***** HELPER METHOD ******************************************************

  executeRequest( dataUrl ) {
    return new Promise((resolve, reject) => {
      http.get(dataUrl)
        .end(function (error, response) {

          if (response.status === 200) {
            const json = JSON.parse(response.text)
            resolve(json)
          }
          else {
            reject(response)
          }
        })
    })
  }
}
