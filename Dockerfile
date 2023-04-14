FROM node:16.20.0-alpine3.17
WORKDIR /app
COPY Tenx.JobMarket.ContractorPortal Tenx.JobMarket.ContractorPortal
WORKDIR /app/Tenx.JobMarket.ContractorPortal
RUN npm ci
EXPOSE 3000
CMD [ "npm", "start" ]