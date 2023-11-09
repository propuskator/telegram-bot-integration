FROM node:14.17.0-alpine AS BUILDER

RUN apk update && \
    apk add --no-cache git

WORKDIR /app

COPY package-lock.json package.json ./

RUN npm i --only=production

# Production stage
FROM node:14.17.0-alpine

WORKDIR /app

COPY --from=BUILDER /app/ .
COPY etc/ etc/
COPY config/ config/
COPY runner.js runner.js
COPY bot.js bot.js
COPY lib/ lib/

CMD [ "npm", "start" ]
