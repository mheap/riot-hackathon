const riotApiHelper = require("./riotApiHelper");
const express = require('express');
const app = express();
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

app.get('/static-data', (req, res) => {
  res.send(staticData);
});

app.get('/match', async (req, res) => {
  try {
    console.log(`/match/v3/matches/${req.query.matchId}`)
    const match = await baseRequest.get(`/match/v3/matches/${req.query.matchId}`)
    const gameData = match.data;

    gameData.userIdentity = gameData.participantIdentities.filter(_pId => _pId.player.summonerName === req.query.summonerName && _pId.player);
    gameData.userParticipant = gameData.participants.filter(_p => gameData.userIdentity[0].participantId === _p.participantId && _p)
    gameData.champData = riotApiHelper.findChamp(gameData, staticData.champions);
    gameData.userItems = riotApiHelper.mapItems(gameData, staticData.items);
    gameData.userSpells = riotApiHelper.mapSpells(gameData, staticData.spells);

    res.send(gameData);
  } catch(e) {
    res.status(e.response.data.status.status_code);

    res.send({ message: "Whoops! Something went wrong...", error: e.response.data.status });
  }
});

app.listen(process.env.PORT_NUMBER, '0.0.0.0', async () => {
  console.log(`Server listening on ${process.env.PORT_NUMBER}`);

  const [champions, items, spells] = await Promise.all([
    axios.get('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json'),
    axios.get('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json'),
    axios.get('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/summoner.json')
  ])

  staticData.champions = champions.data;
  staticData.items = items.data;
  staticData.spells = spells.data;
});