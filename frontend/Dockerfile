# Step 1: Use the official Nginx image to serve static files
FROM nginx:alpine

# Step 2: Remove the default nginx welcome page
RUN rm /usr/share/nginx/html/*

# Step 3: Copy your frontend files (HTML, CSS, JS) to the Nginx html directory
COPY ./frontend /usr/share/nginx/html

# Step 4: Expose the port that nginx will run on
EXPOSE 80

# Step 5: Run nginx (this is the default command for the nginx image)
CMD ["nginx", "-g", "daemon off;"]
