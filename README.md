# Starting

 - Create `RankingMaster.env` file
 - define following env variables in file:
   - RIOT_KEY=<KEY>
   - RIOT_LOL_API_KEY=<KEY>
    - MONGO_INITDB_ROOT_USERNAME: root
    - MONGO_INITDB_ROOT_PASSWORD: password1
    - MONGO_USERNAME: root
    - MONGO_PASSWORD: password1

# Running

cd to folder with Riot-Hackathon folder

`docker-compose up`

after making changes:

`docker-compose up --build`
