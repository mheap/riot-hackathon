const riotApiHelper = require("./riotApiHelper");
const matchStore = require('./matchStore')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const axios = require('axios');
require('dotenv').config();

const staticData = {
  champions: {},
  items: {},
  spells: {}
}

const baseRequest = axios.create({
  baseURL: 'https://na1.api.riotgames.com/lol',
  headers: {
    'X-Riot-Token': process.env.RIOT_KEY
  }
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Riot-Token');
  next();
});

app.post('/upload', async (req, res) => {
  console.log(req.body);
  res.send('whuat');
})

app.get('/static-data', (req, res) => {
  res.send(staticData);
});

app.get('/match', async (req, res) => {
  try {
    console.log(`/match/v3/matches/${req.query.matchId}`)
    if (!req.query.matchId) {
      res.status(400)
      res.send('missing matchId!')
      return
    }

    if (!req.query.summonerName) {
      res.status(400)
      res.send('missing summonerName!')
      return
    }

    const gameData = await matchStore.getMatch(req.query.matchId);
      console.log(gameData);
    let sanitizedData = {};

    sanitizedData.userIdentity = gameData.participantIdentities.filter(_pId => _pId.player[0].summonerName == req.query.summonerName && _pId.player);
    sanitizedData.userParticipant = gameData.participants.filter(_p => sanitizedData.userIdentity[0].participantId === _p.participantId && _p)
    sanitizedData.champData = riotApiHelper.findChamp(sanitizedData, staticData.champions);
    sanitizedData.userItems = riotApiHelper.mapItems(sanitizedData, staticData.items);

    res.send(sanitizedData);
  } catch(e) {
    console.log(e)
    res.status(500);

    res.send({ message: "Whoops! Something went wrong...", error: e });
  }
});

app.get('/leaderboard/:champ_id', async (req, res) => {
  const leaderboardData = await matchData.getLeaderboard(req.query.champ_id);

  res.send(leaderboardData)
});

app.post('/evaluate', async (req, res) => {
  rs.send('90001');
});


app.listen(3000, '0.0.0.0', async () => {
  console.log(`Server listening on 3000`);

  const [champions, items, spells] = await Promise.all([
    axios.get('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json'),
    axios.get('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json'),
    axios.get('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/summoner.json')
  ])

  staticData.champions = champions.data;
  staticData.items = items.data;
  staticData.spells = spells.data;
});
