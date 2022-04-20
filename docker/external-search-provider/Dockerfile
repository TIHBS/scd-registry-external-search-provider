FROM node:16

WORKDIR /home/node/

COPY . .

RUN chown -R node /home/node/
USER node

RUN npm i 
RUN npm run build

CMD npm start
