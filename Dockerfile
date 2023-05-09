FROM node:16.20.0-alpine3.17
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 3000
CMD [ "yarn", "start" ]