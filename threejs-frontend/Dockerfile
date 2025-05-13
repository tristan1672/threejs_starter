FROM node:18 AS builder

WORKDIR /threejs_starter

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 5173

CMD ["npm", "run", "dev"]
