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

