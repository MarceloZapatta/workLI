# Use the official Deno image from the Deno team as the base image
FROM denoland/deno:alpine-2.0.0

# Set the working directory inside the container
WORKDIR /app

# Copy the project files from your host machine to the container
COPY . .

# Cache dependencies by creating a layer with the dependencies only
RUN deno cache index.ts

# Keep the container alive by running an infinite loop
CMD ["tail", "-f", "/dev/null"]
