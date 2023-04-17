FROM node:16.20.0-alpine3.17
WORKDIR /app
COPY . .
RUN npm ci
EXPOSE 3010
CMD [ "npm", "start" ]