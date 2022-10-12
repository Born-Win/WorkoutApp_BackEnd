FROM node:16.17.1

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 80
CMD npm run start
