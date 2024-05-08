
# backend - pin point

This is the backend [for vue-pinpoin](https://github.com/arbaazmir-1/vue-pinpoint)


## Project Setup
This project uses nodejs and express js. Install nodejs if you don't already have it. You Will also need EmailJs Account and provide the variables like show in the env below
Then run this in the project directory:
```sh
npm install
```

This Project Needs 6 env variables, eg:

```ssh
MONGODB_URL="mongodb://demo:password@127.0.0.1:27017/pinpoint?authMechanism=SCRAM-SHA-256&authSource=admin"
JWT_SECRET="example"
EMAILJS_PRIVATE_KEY ="example"
EMAILJS_TEMPLATEID="example"
EMAILJS_SERVICEID="example"
EMAILJS_PUBLIC_KEY="example"
```

### Start Server for Development

```sh
npm run dev
```
