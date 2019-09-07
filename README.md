# Mbanq API Client for Web Applications
Intended to be used to handle authentication and calls to the Mbanq API.

This API client is used in the
[mbanq-hackathon-template](https://github.com/Mbanq/mbanq-hackathon-template)


> This package was created for the hackathon and is not intended to be used in
> production.

# Create an API client
Mbanq API client is very use to use.

Firs you have to add it to your application:

```bash
npm i -S Mbanq/mbanq-api
```

Before you can make calls to the self-service API, you have to initialize a new
API client and authenticate yourself.

To create the API client you have to do the following:

```js
const Mbanq = require('@mbanq/api')

const Client = new Mbanq({
  baseURL: 'https://api.cloud.mbanq.com',
  tenantId: 'your-tenant-identifier',
  clientId: 'your-client-identifier',
  clientSecret: 'your-client-secret'
})
```

- `baseURL`: default setting points to Mbanq's evaluation evironment
  https://api.cloud.mbanq.com. If you work with the evaluation environment you
don't have to do anything
- `tenantId`: Tenant identifier of your core banking instance that you created
  in the `console` application e.g. https://console.cloud.mbanq.com
- `clientId`: Client identifier of the App you created for the API use
- `clientSecret`: Client secret of the App you created for the API use

# Authenticate yourself
Once you created an API client, you have to authenticate yourself before you
start making calls to the API.
To authenticate yourself you have to call `Client.auth()` function with `js`
object that contains your `username` and `password` - see example below.

```js
Client.auth({ username: 'web1', password: 'password' })
```

After the successful `Client.auth()` call, you should have the API tokens in the `localStorage` of your browser and you can start calling the API.

# Calling the API
The `mbanq-api-client` offers you an easy way of making calls to Mbanq API. It
offers a very limited set of functionality and is only intended to be used for
small MVPs.

Once you created the `Mbanq APi Client` with the use of your `tenantId`,
`clientId` and `clientSecret` and authenticated yourself by running
`Client.auth(credentials)` you can start making calls to the api:

```js
const api = Client.api()

// if you wanna do it right
// you should use a `try` and `catch` block

const yourFunction = async () => {
  try {
    const user = await api.user()
    const clients = await api.clients()
    const firstClientsAccounts = await api.accounts(clients.pageItems[0].id)
  } catch (error) {
    return error
  }
}
```

## Creating a transfer
Since every transfer has to be confirmed with an OTP (one time password), creating a `transfer` is a multi step process. First you have to create a transfer draft and then you have to submit your draft's `resourceId` together with an OTP.

```js
const recipient = {
  fullName: 'Bart Simpson',
  from: {
    accountNumber: '000000011'
  },
  to: {
    sortCode: '12345678',
    accountNumber: '000000012'
  },
  currency: 'USD',
  subject: 'Keep up the good work, Bart',
  amount: 666.66
}

const createTransferDraft = async (recipient) => {
  try {
    return await api.transfer(recipient)
  } catch (error) {
    return error
  }
}
```

After the draft of the transfer has been created, you should receive:
- a `resource_id` in the response and
- an OTP delivered to your email address

After it you can submit the transfer:

```js
const transfer = {
  id: 123455, // resource_id you received when creating the draft
  otp: 12345 // OTP that's been delivered to your email address
}

const submitTransfer = async (transfer) => {
  try {
    return api.confirmTransfer(transfer)
  } catch (error) {
    return error
  }
}
```
