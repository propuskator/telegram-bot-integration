# Telegram bot

The telegram bot for managing Propuskator access points. It is written using popular framework Telegraf.js: 
https://github.com/telegraf

## Configuration

### Steps to retrieve and set up bot token

The main thing you need to launch the bot is to create it and retrieve its token:
1) Create a new bot and retrieve its token as described here: https://core.telegram.org/bots#6-botfather
2) Set this value for the "TELEGRAM_BOT_TOKEN" variable in .env file, for other values required by the service defaults
defined in the docker-compose.yml file will be used

### Configuration variables

- TELEGRAM_BOT_TOKEN - a retrieved bot token
- TELEGRAM_BOT_BASE_URL - a base URL that should be used for webhook(if bot service will be launched in webhook mode)
- TELEGRAM_BOT_PORT - a port which bot service should listen in webhook mode
- TELEGRAM_BOT_UPDATE_MODE - a mode to launch bot service in, possible values('polling', 'webhook'):
    - polling - if you set this value, then bot will start in polling mode. There is no need to launch Nginx in this
    mode
    - webhook - if you set this value, then bot will start in webhook mode. You necessarily need to launch Nginx
    with open to the world host. It will proxy incoming requests to the Telegram bot service,
    see details about webhook mode [here](https://core.telegram.org/bots/webhooks), see why we use special
    route(which includes token) for Nginx location for Telegram bot service
    [here](https://core.telegram.org/bots/api#setwebhook)
- SESSION_COOKIE_SECRET - a JWT token secret that should be the same with secret which is used in access-backend service 
to generate valid tokens that can be used to access the access-backend API

## Launching

### Production mode

If you need to launch Telegram bot service in production mode locally then you need to have host that is open to the 
world, it is easy to use Ngrok for this task:
```shell
ngrok http 80
```

Then copy https URL and set for the "TELEGRAM_BOT_BASE_URL" env and complete the following steps:

```shell
# In the directory with cloned telegram-bot project:
docker build -t propuskator/telegram-bot-integration:release .
# In the composer directory:
docker-compose up -d access-nginx access-percona telegram-bot
```

### Development mode

```shell
# In the composer directory:
./develop.sh build # choose the telegram-bot service and finish
./develop.sh up # choose the telegram-bot service and access-percona and finish
```

## Important notes

- Telegraf.js entities methods signatures are based on the official doc: https://core.telegram.org/bots/api, so it is
important to look into it to understand how this methods works and what they exactly do under the hood
- Feel free to set demo server URL for the "MQTT_URI" variable and restore database backup locally if you need to
reproduce demo server state locally