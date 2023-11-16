# Dockerfile
FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/backend
WORKDIR /opt/backend
COPY app/package.json app/package-lock.json ./
RUN npm install
COPY app/ .
EXPOSE 3000
CMD [ "npm", "run", "start"]