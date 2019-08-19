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
      throw Error(`Booo! Here is what happened: ${error.message}`)
    }
  )

  return client
}

Mbanq.prototype.api = function () {
  // for all the REST API requests
  const req = request(this)
  // for the GraphQL requests
  const gql = Object.assign(this, {
    baseURL: `${this.baseURL}/graphql`,
    method: 'post'
  })
  const gqlReq = request(gql)
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
    transfer: async (recipient) => {
      try {
        if (!recipient) {
          throw Error(`Please provide recipient details: name, sortCode, accountNumber and amount`)
        }
        return await gqlReq({
          method: gql.method,
          baseURL: gql.baseURL,
          data: {
            query: `
              mutation {
                createTransfer(transferInput: {
                  type: "CREDIT"
                  currency: "${recipient.currency}"
                  amount: ${recipient.amount}
                  dateFormat: "YYYY-MM-DD"
                  reference: ${JSON.stringify(recipient.subject)}
                  debtor: {
                    identifier: "ACCOUNT:${recipient.from.accountNumber}"
                  }
                  creditor: {
                    identifier: "SWIFT://${recipient.to.sortCode}/${recipient.to.accountNumber}"
                    name: "${recipient.fullName}"
                }
                }
                ) {resourceId}
              }
            `
          }
        })
      } catch (error) {
        return error
      }
    },
    confirmTransfer: async (transfer) => {
      const { id, otp } = transfer
      const headers = {
        'OTP-Token': otp || ''
      }
      return gqlReq({
        method: gql.method,
        baseURL: gql.baseURL,
        data: {
          query: `
            mutation {
              submitTransfer (transferId:${Number(id)}){
                resourceId
              }
            }
          `
        },
        headers
      })
    }
  }
}
