# mbanq-api-client
Intended to be used to handle authentication and calls to the Mbanq API in `js` based frontend applications.

This API client is used in the
<a href="https://github.com/Mbanq/mbanq-hackathon-template" target="_blank">mbanq-hackathon-template</a>


> This package was created for the hackathon and is not intended to be used in
> production.

# Create an API client
Mbanq API client is very use to use.

Firs you have to add it to your application:

```bash
npm i -S Mbanq/mbanq-api-client
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
  `https://api.cloud.mbanq.com`. If you work with the evaluation environment you
don't have to do anything
- `tenantId`: Tenant identifier of your core banking instance that you created
  in the `console` application e.g. <a href="https://console.cloud.mbanq.com" target="_blank">Mbanq Cloud Console</a>
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
Before you create a transfer you can check which accounts you can send money to, by calling `api.transferTemplates()`.

Once you know the accounts that are eligible for money transfers you can call `api.createTransfer(transfer)` where transfer object has to have the following data:
```js
  const transfer = {
    fromOfficeId: 1,
    fromClientId: 11,
    fromAccountType: 2,
    fromAccountId: 11,
    toOfficeId: 1,
    toClientId: 12,
    toAccountType: 2,
    toAccountId: 12,
    dateFormat: 'dd MMMM yyyy',
    locale: 'en',
    transferDate: '4 September 2019',
    transferAmount: '1.00',
    transferDescription: 'Subject of the transfer'
  }
  
  const sendMoney = async (transfer) => {
  try {
    return await api.createTransfer(transfer)
  } catch (error) {
    return error
  }
}
```

# Report a problem
Whenever you experience a problem with this template or the <a href="https://github.com/Mbanq/mbanq-api-client" target="_blank">mbanq-api-client</a>

<a href="https://github.com/Mbanq/mbanq-api-client/issues/new" target="_blank">Create an Issue</a>
