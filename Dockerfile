FROM node:20.17.0-alpine3.19
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 3000
CMD [ "yarn", "start" ]