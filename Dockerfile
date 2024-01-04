FROM node:18
WORKDIR /app
COPY package* .
RUN npm i
COPY . .

CMD [ "npm", "run", "production" ]