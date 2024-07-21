# NPM Install
FROM node:latest
#  WORKDIR /Users/yevhenright/DayPatron__Next__
WORKDIR /DayPatron__Next__
# COPY package*.json ./
COPY package*.json ./

# Install dependencies with legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Build the Next.js application
RUN npm run build

# Start the Next.js application
CMD ["npm", "run", "dev"]

EXPOSE 8080


