'use strict'

import axios from 'axios'
import defaults from './defaults'

const api = axios.create({
  baseURL: `${this.baseURL}/v1/self`,
  timeout: 4000,
  headers: Object.assign(this.headers, {
    'Content-Type': 'application/json',
    'tenantId': this.tenantId,
    Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
  })
})
