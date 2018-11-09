FROM node:alpine

WORKDIR /src

COPY . /src

RUN npm set progress=false
RUN npm i --dev

EXPOSE 4000

CMD [ "npm", "run", "start" ]