FROM node:10

ARG env
ENV NODE_ENV=$env

ARG port
ENV PORT=$port

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY /dist ./dist
USER node