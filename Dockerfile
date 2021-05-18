FROM node
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD [ "node", "bin/index.js" ]