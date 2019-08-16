'use strict'

import defaults from './defaults'
import './api'
const axios = require('axios')

// move to utils later
const transformRequest = (jsonData = {}) =>
  Object.entries(jsonData)
    .map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
    .join('&')

export default function Mbanq ({
  baseURL = defaults.baseURL,
  tenantId = defaults.tenantId,
  clientId = defaults.clientId,
  clientSecret = defaults.clientSecret,
  headers = defaults.headers
}) {
  if (!tenantId) {
    throw new Error('tenantId parameter is required')
  }
  this.baseURL = baseURL
  this.authURL = `${this.baseURL}/oauth/token`
  this.tenantId = tenantId
  this.clientId = clientId
  this.clientSecret = clientSecret
  this.grantType = defaults.grantType
  this.headers = Object.assign({ tenantId: this.tenantId }, defaults.headers)
}

/**
 * credentials = {
 *   username: 'web1',
 *   password: 'password'
 * }
 *
**/

Mbanq.prototype.auth = async function (credentials) {
  const { username, password } = credentials
  const auth = axios.create({
    baseURL: this.authURL,
    timeout: 4000,
    headers: {
      tenantId: this.tenantId,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: data => {
      return transformRequest(data)
    }
  })
  const data = {
    username,
    password,
    'client_id': this.clientId,
    'client_secret': this.clientSecret,
    'grant_type': this.grantType
  }
  try {
    const response = await auth({
      method: 'post',
      data
    })
    // set the localStorage
    Object.keys(response.data).forEach(key => {
      window.localStorage.setItem(key, response.data[key])
    })
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}
