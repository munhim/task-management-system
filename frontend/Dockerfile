# Use an official Nginx image to serve the static files
FROM nginx:alpine
# Set the working directory inside the container
WORKDIR /usr/share/nginx/html
# Remove the default Nginx index.html
RUN rm -rf ./*
# Copy the frontend files to the Nginx container
COPY ./ /usr/share/nginx/html
# Expose the port Nginx will run on
EXPOSE 5050
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
