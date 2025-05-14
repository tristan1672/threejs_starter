FROM node:18 AS builder

WORKDIR /threejs-frontend

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 5173

CMD ["npm", "run", "dev"]
