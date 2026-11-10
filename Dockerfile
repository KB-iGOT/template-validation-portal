FROM node:22 AS build

WORKDIR /app

RUN npm install -g @angular/cli@13.3.0
COPY package*.json ./
RUN npm install

COPY . .
# Angular 13 webpack needs the OpenSSL legacy provider on Node 17+
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN ng build --configuration=production

# Stage 2: Create a lightweight container with Node.js to serve the Angular application
FROM node:22 AS final
# Create a non-root user
RUN useradd -m appuser

WORKDIR /usr/src/app
COPY --from=build /app/dist/template-validation-portal/* ./dist/
RUN npm install -g serve

# Give directory ownership to non-root user
RUN chown -R appuser:appuser /usr/src/app

# Switch to appuser
USER appuser
EXPOSE 3111

CMD ["serve", "-s", "dist", "-p", "3111"]
