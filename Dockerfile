FROM node:17.7.1-alpine AS build

WORKDIR /app

COPY package.json yarn.lock  ./
RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

# Prune dev dependencies
RUN yarn --production --frozen-lockfile

FROM node:17.7.1-alpine AS production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]
