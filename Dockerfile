FROM node:14.17.1-alpine AS build
WORKDIR /tmp
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY . .
RUN yarn build

FROM node:14.17.1-alpine
RUN mkdir -p /app && chown -R node:node /app
USER node
WORKDIR /app
COPY --from=build /tmp/node_modules/ ./node_modules
COPY --from=build /tmp/index.html /tmp/loaderio-304ff6a00b644e779082c6647571f070.txt ./
COPY --from=build /tmp/dist/ .
ENV NODE_ENV="production"
CMD ["node","./main.js"]
##bunu yazarken ne uğraştım


