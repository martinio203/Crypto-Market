FROM node:20-alpine
WORKDIR /usr/src/app
COPY market-frontend/package*.json ./
RUN npm install
COPY market-frontend/ .
EXPOSE 3000
CMD ["npm", "start"]
