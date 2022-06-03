FROM node

WORKDIR /

COPY package.json ./

RUN npm install

COPY . .

ENV PORT=1337

EXPOSE 1337

CMD [ "node", "app.js" ]