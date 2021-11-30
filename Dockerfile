# FROM node:14-alpine AS build
# WORKDIR /tmp
# COPY package.json yarn.lock ./
# RUN yarn install
# COPY . .
# RUN yarn build

# FROM node:14-alpine
# WORKDIR /app
# COPY --from=build /tmp/index.html ./dist/
# COPY --from=build /tmp/dist/ ./dist
# COPY --from=build /tmp/node_modules/ ./node_modules
# ENV NODE_ENV=production
# CMD ["node","./dist/main.js"]


FROM node:14-alpine AS build
WORKDIR /tmp
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY . .
RUN yarn build

FROM node:14-alpine
WORKDIR /app
COPY --from=build /tmp/dist/ ./dist
COPY --from=build /tmp/index.html ./dist/
COPY --from=build /tmp/node_modules/ ./node_modules
