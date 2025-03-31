# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Vite globally (or locally if preferred)
RUN npm install -g vite

RUN npm install --save ag-grid-community

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Run the Vite development server
CMD ["npm", "run", "dev"]