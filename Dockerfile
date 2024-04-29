#This should auto populate.install docker autopopulate
FROM node:slim
#set working directory as /app
WORKDIR /app
#copy all the contents of the current folder to /app
COPY . /app
#Delete all node-modules
CMD sudo rm -rf node_modules
#install the dependencies
RUN npm install
#opens the tcp port 3000 from the container for communicating with apis
EXPOSE 3000
#stat the nodejs server
CMD node index.js
