# Use official Node.js image as the base image
FROM node:16-alpine
# Set the working directory inside the container
WORKDIR /usr/src/app
# Copy the package.json and package-lock.json to install dependencies first
COPY package*.json ./
# Install dependencies
RUN npm install 
# Copy the rest of the application files into the container
COPY . .
# Expose the port the app will run on (your service runs on port 3001)
EXPOSE 3001
# Command to start the service
CMD ["npm", "start"]
