export default {
    env : process.env.NODE_ENV,
    bot : {
        updateMode : process.env.TELEGRAM_BOT_UPDATE_MODE, // available values: "polling" or "webhook"
        token      : process.env.TELEGRAM_BOT_TOKEN,
        baseUrl    : process.env.TELEGRAM_BOT_BASE_URL,
        port       : process.env.TELEGRAM_BOT_PORT
    },
    mqtt : {
        uri      : process.env.MQTT_URI,
        username : process.env.MQTT_USER,
        password : process.env.MQTT_PASS
    },
    secret   : process.env.SESSION_COOKIE_SECRET,
    services : {
        backend : {
            protocol : process.env.ACCESS_BACKEND_PROTOCOL || 'http',
            host     : process.env.ACCESS_BACKEND_HOST || 'access-backend',
            port     : process.env.ACCESS_BACKEND_PORT || 8000
        }
    }
};
