# Dockerfile

# Base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Your app binds to port 3001 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3001

# Define the command to run your app using CMD which defines your runtime
CMD [ "npm", "start" ]