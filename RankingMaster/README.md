## Setup: 
You will need a .env folder with the following variables set: `RIOT_KEY`, `PORT_NUMBER`

## Build command

`docker build --tag rankingmaster .`

## Run command

`docker run -e RIOT_KEY='<API_KEY>' -p 3000:3000 rankingmaster`
