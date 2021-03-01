FROM node:11.14.0
WORKDIR /app
EXPOSE 80



ADD . /app
RUN npm install
RUN npm install -g forever


CMD ["forever", "server.js"]
