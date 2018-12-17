# scytale-server

Simple Socket.io server for the scytale app.

The purpose of this server is to be as simple as posible and reveal as less information about the clients as possible. Thus, it doesn't need to keep a list of connected users or any other info about the clients.

The clients can exchange any information they need over the secure p2p connections they have establisthed!

## Deploy your own private server on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cpapazaf/scytale-server/tree/master)

For more configurations on Heroku check : `https://devcenter.heroku.com/articles/node-websockets`

## Security

I'm not expert in Security but I will try to use common sense :)

Here are the steps I have followed:

* Use only important 3rd party modules. This way we avoid the insecure dependencies.
* Use SSL. That is already offered by heroku. In case of self-signed [certs](https://socket.io/docs/client-api/#With-a-self-signed-certificate) the desktop app allows for configuring the `server-cert.pem` file.
* Eliminate CORS through `socket.io#origins`
* Check the server at `https://securityheaders.com`
* Use `rejectUnauthorized: true` to avoid MITM attacks
