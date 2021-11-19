FROM node:lts-alpine@sha256:3bca55259ada636e5fee8f2836aba7fa01fed7afd0652e12773ad44af95868b9

# ENV NODE_ENV production

RUN mkdir -p /node/app && chown -R node:node /node/app

WORKDIR /node/app

COPY package.json yarn.lock ./

RUN yarn install --production

USER node

COPY --chown=node:node . .




