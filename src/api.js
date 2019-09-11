'use strict'

import Mbanq from './index'
import axios from 'axios'

const request = (config) => {
  const client = axios.create({
    baseURL: `${config.baseURL}/v1/self`,
    timeout: 4000,
    headers: Object.assign(config.headers, {
      'tenantId': config.tenantId,
      Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
    })
  })

  client.interceptors.response.use(
    response => {
      return response.data
    },
    error => {
      throw Error(`Booo! Here is what happened: ${error}`)
    }
  )

  return client
}

Mbanq.prototype.api = function () {
  // for all the REST API requests
  const req = request(this)
  return {
    user: async function () {
      try {
        return await req({
          method: 'get',
          url: `/userdetails`
        })
      } catch (error) {
        return error
      }
    },
    clients: async (id) => {
      try {
        if (!id) {
          return await req({
            method: 'get',
            url: '/clients'
          })
        }
        return await req({
          method: 'get',
          url: `/clients/${id}`
        })
      } catch (error) {
        return error
      }
    },
    accounts: async (clientId) => {
      try {
        if (!clientId) {
          throw Error(`Please provide a 'clientId'`)
        }
        return await req({
          method: 'get',
          url: `/clients/${clientId}/accounts`
        })
      } catch (error) {
        return error
      }
    },
    /*
     * {
     *   fullName: String,
     *   from: {
     *     accountNumber: String
     *   },
     *   to: {
     *     sortCode: String,
     *     accountNumber: String,
     *   },
     *   currency: String,
     *   subject: String,
     *   amount: Number
     * }
     */
    transferTemplates: async () => {
      try {
        return await req({
          method: 'get',
          url: `/accounttransfers/template?type=tpt`
        })
      } catch (error) {
        return error
      }
    },
    createTransfer: async (transfer) => {
      try {
      //  const data = {
      //    fromOfficeId: 1,
      //    fromClientId: 11,
      //    fromAccountType: 2,
      //    fromAccountId: 11,
      //    toOfficeId: 1,
      //    toClientId: 12,
      //    toAccountType: 2,
      //    toAccountId: 12,
      //    dateFormat: 'dd MMMM yyyy',
      //    locale: 'en',
      //    transferDate: '4 September 2019',
      //    transferAmount: transfer.amount || '1.00',
      //    transferDescription: transfer.subject
      //  }
        return await req({
          method: 'post',
          url: `/accounttransfers?type=tpt`,
          data: transfer
        })
      } catch (error) {
        return error
      }
    },
    transactions: async (clientId) => {
      try {
        return await req({
          method: 'get',
          url: `/savingsaccounts/${clientId}?associations=transactions`
        })
      } catch (error) {
        return error
      }
    }
  }
}
