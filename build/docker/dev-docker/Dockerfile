FROM node:18.16.0

WORKDIR /usr/src/app

COPY . .
# RUN rm -rf ./node_modules // can be useful when building locally 
RUN npm install

RUN npm run build
RUN ls | grep -v -E 'dist|node_modules|config' | xargs rm -rf

RUN mv ./dist/migrations .

COPY package*.json ./

EXPOSE 8080