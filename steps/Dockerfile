FROM node:11.14.0
WORKDIR /app
EXPOSE 80



ADD . /app
RUN npm install express
RUN npm install express-session
RUN npm install nconf
RUN npm install -g forever
RUN npm install mustache
RUN npm install mongodb
RUN npm install connect-mongo
RUN npm install moment
RUN npm install body-parser


CMD ["forever", "server.js"]