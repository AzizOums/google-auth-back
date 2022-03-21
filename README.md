# Google Auth

Authentication with google in node js using express, redis and googleapis library

## Setup

- Run `yarn install`
- You must have a redis instance running
- Set `.env` file

```
  GOOGLE_CLIENT_ID="<client ID>"
  GOOGLE_CLIENT_SECRET="<client secret>"
  REDIRECT_URI="<BASE_URL>/api/auth/login"
  SESSION_SECRET="<string to use as session secret>"
  SESSION_DOMAIN="<app domain>"
  REDIS_HOST="<your redis host>"
  REDIS_PORT="<your redis port>"
```

## Run dev mode

- `yarn start:debug`

## PM2 Commands

- `./node_modules/.bin/pm2 log <id>` see logs
- `./node_modules/.bin/pm2 stop <id>` stop the instance
- `./node_modules/.bin/pm2 restart <id>` restart the instance
- `./node_modules/.bin/pm2 delete <id>` delete the instance
