FROM node:17.7.1-alpine AS build

WORKDIR /app

COPY package.json yarn.lock  ./
RUN apk add g++ make python3 py3-pip
RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

# Prune dev dependencies
RUN yarn --production --frozen-lockfile

FROM node:17.7.1-alpine AS production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Files below are need to run DB Migration
COPY --from=build /app/.sequelizerc ./.sequelizerc
COPY --from=build /app/src/config/database/sequelize.config.js ./src/config/database/sequelize.config.js
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock

CMD ["node", "dist/main"]
