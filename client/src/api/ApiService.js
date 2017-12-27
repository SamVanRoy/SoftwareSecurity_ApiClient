import EventEmitter from 'eventemitter3'
import axios from 'Axios'

export default class AuthService {
  apiNotifier = new EventEmitter()
  response = {}

  constructor () {
    this.getPublic = this.getPublic.bind(this)
    this.getPrivate = this.getPrivate.bind(this)
  }

  /**
   * Get Private api resource
   */
  getPublic () {
    console.log('public')
    axios.get('https://0ki4kkvnnb.execute-api.eu-west-1.amazonaws.com/api/public')
      .then(response => {
        this.response.publicResponse = response.data
      })
      .catch(error => {
        this.errorHandler(error.response.status)
        console.log(error.response.status)
      })
      .then(() =>
        this.apiNotifier.emit('apiService', this.response)
      )
  }

  /**
   * Get Private api resource
   */
  getPrivate () {
    console.log('private')
    let axiosI = this.getAxios()
    if (axiosI) {
      axiosI.get('private')
        .then(response => {
          this.response.privateResponse = response.data
        })
        .catch(error => {
          this.errorHandler(error.response.status)
          console.log(error.response.status)
        })
        .then(() =>
          this.apiNotifier.emit('apiService', this.response)
        )
    } else {
      this.errorHandler(401)
      // this.response.apiError = 'Please login before being able to make private requests'
      this.apiNotifier.emit('apiService', this.response)
    }
  }

  /**
   * Public return new axios with Authorization header
   * @returns {boolean}
   */
  getAxios () {
    if (localStorage.getItem('access_token') === null) {
      return false
    }

    var axiosI = axios.create({
      baseURL: 'https://0ki4kkvnnb.execute-api.eu-west-1.amazonaws.com/api/',
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('access_token')}
    })

    return axiosI
  }

  /**
   * Public http error status to message handler
   * @param status
   */
  errorHandler (status) {
    let DEFAULT_ERROR = 'There seems to be an error with the api, please contact the administrator'
    switch (status) {
      case 401:
        this.response.apiError = status + ' Unauthorized: Please login before being able to make private requests'
        break
      case 404:
        this.response.apiError = status + ' Not Found: ' + DEFAULT_ERROR
        break
      case 405:
        this.response.apiError = status + ' Method Not Allowed: ' + DEFAULT_ERROR
        break
    }
    console.log(this.response.apiError)
    this.apiNotifier.emit('apiService', this.response)
  }
}
