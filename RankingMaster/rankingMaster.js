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

function createRankRecord() {

};

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

const sanitizeMatchDataForSummoner = async (matchId, summonerName) => {
  const gameData = await matchStore.getMatch(matchId);
  let sanitizedData = { totalGameKills: 0, totalGameDamage: 0, gameDuration: gameData.gameDuration, rawGameScore: {} };

  sanitizedData.userIdentity = gameData.participantIdentities.filter(_pId => _pId.player[0].summonerName == summonerName && _pId.player);
  sanitizedData.userParticipant = gameData.participants.filter(_p => sanitizedData.userIdentity[0].participantId === _p.participantId && _p)
  sanitizedData.champData = riotApiHelper.findChamp(sanitizedData, staticData.champions);
  sanitizedData.userItems = riotApiHelper.mapItems(sanitizedData, staticData.items);


  gameData.participants.forEach(player => {
    if (player.teamId === sanitizedData.userParticipant[0].teamId) {
      sanitizedData.totalGameKills += player.stats.kills;
      sanitizedData.totalGameDamage += player.stats.totalDamageDealtToChampions;
    }
  });

  return sanitizedData
}

const getRankForSummoner = async (sanitizedData) => {
  const user = sanitizedData.userParticipant[0];
  const rawScore = sanitizedData.rawGameScore;

  rawScore.CsPerMinute = user.stats.totalMinionsKilled / sanitizedData.gameDuration;
  rawScore.Kda = (user.stats.kills + user.stats.assists) / user.stats.deaths;
  rawScore.VisionScorePerHour = user.stats.visionScore;
  rawScore.CsDiffAtLaningEnd = user.timeline.csDiffPerMinDeltas["0-10"] + user.timeline.csDiffPerMinDeltas["10-20"];
  rawScore.DamagePerGold = user.stats.totalDamageDealtToChampions / user.stats.goldEarned;
  rawScore.DamagePerDeath = user.stats.totalDamageDealtToChampions / user.stats.deaths;
  rawScore.teamDamagePercentage =  user.stats.totalDamageDealtToChampions / sanitizedData.totalGameDamage;
  rawScore.KillParticipation = user.stats.kills / sanitizedData.totalGameKills;

  const rank = riotApiHelper.rankStats(rawScore, sanitizedData.userParticipant[0].championId);

  return rank
}

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

    const sanitizedData = await sanitizeMatchDataForSummoner(matchId, req.query.summonerName)
    const rank = await getRankForSummoner(sanitizedData)

    console.log('rank', rank)
    
    res.send(sanitizedData);
  } catch(e) {
    console.log(e)
    res.status(500);

    res.send({ message: "Whoops! Something went wrong...", error: e });
  }
});



app.get('/leaderboard/:champ_id', async (req, res) => {
  // The champ names sent to this endpoint need to be properly capitalized,
  // see the ddragon json payload to confirm
  try {
    const leaderboardData = await matchStore.getLeaderboard(staticData.champions.data[req.params.champ_id].key);
    res.send(leaderboardData)
  } catch(e) {
    res.send({ message: 'Whoops! Something went wrong...', error: e })
  }
});

app.post('/evaluate', async (req, res) => {
  rs.send('90001');
  // matchStore.setLeaderboard(req.params.player, req.params.matchId, req.params.championId);
});

app.get('/seed', (req, res) => {
  matchStore.startSeed()
  res.send('ok')
})


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
