FROM node:14.16.0-alpine3.13
WORKDIR /src/usr/app/front

COPY package.json package-lock.json ./
RUN npm install
COPY . .
