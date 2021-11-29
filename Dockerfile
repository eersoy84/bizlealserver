FROM node:14-alpine AS BUILD_IMAGE
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn build

RUN ls -l

FROM node:14-alpine
WORKDIR /app
COPY --from=BUILD_IMAGE /app/dist /app/package.json ./
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
CMD ["yarn","prod"]

