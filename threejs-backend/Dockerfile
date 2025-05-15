FROM node:18 AS builder

WORKDIR /threejs-backend

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
