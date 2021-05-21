FROM node
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json .
RUN npm install --quiet
RUN npm install nodemon -g --quiet
RUN npm install typescript -g
COPY . .
EXPOSE 8000
RUN npm run build
CMD ["nodemon", "dist/server.js"]