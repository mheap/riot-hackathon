FROM node:10-alpine

WORKDIR /RankingMaster

COPY . /RankingMaster
RUN npm set progress=false
RUN npm i

EXPOSE 3000

CMD [ "npm", "run", "start" ]
