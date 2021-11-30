FROM node:14-alpine AS build
WORKDIR /tmp
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY . .
RUN yarn build

FROM node:14-alpine
WORKDIR /app
COPY --from=build /tmp/index.html ./dist/
COPY --from=build /tmp/package.json /tmp/yarn.lock ./
COPY --from=build /tmp/dist/ ./dist
COPY --from=build /tmp/node_modules/ ./node_modules
CMD ["yarn","start"]
##bunu yazarken ne uğraştım


