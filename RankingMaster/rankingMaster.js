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



app.get('/match', async (req, res) => {
  try {
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

    const sanitizedData = await matchStore.getRankForPlayerMatch(req.query.summonerName, req.query.matchId, staticData)

      sanitizedData.match = sanitizedData.match[0];
      sanitizedData.myData = sanitizedData.match.participants.filter((d) => d.championId == sanitizedData.championId)[0];
      sanitizedData.champ = Object.values(staticData.champions.data).filter((d) => {return d.key == sanitizedData.championId})[0];

      const user = sanitizedData.myData;
      sanitizedData.rawGameScore = {};
          sanitizedData.rawGameScore.creepKillsPerMinute = user.stats.totalMinionsKilled / sanitizedData.gameDuration;
    sanitizedData.rawGameScore.kda = (user.stats.kills + user.stats.assists) / user.stats.deaths;
    sanitizedData.rawGameScore.visionScore = user.stats.visionScore;
    sanitizedData.rawGameScore.csLaneDiff = user.timeline.csDiffPerMinDeltas["0-10"] + user.timeline.csDiffPerMinDeltas["10-20"];
    sanitizedData.rawGameScore.damagePerGold = user.stats.totalDamageDealtToChampions / user.stats.goldEarned;
    sanitizedData.rawGameScore.damagePerDeath = user.stats.totalDamageDealtToChampions / user.stats.deaths;
    sanitizedData.rawGameScore.teamDamagePercentage =  user.stats.totalDamageDealtToChampions / sanitizedData.totalGameDamage;
    sanitizedData.rawGameScore.killParticipation = user.stats.kills / sanitizedData.totalGameKills;

    res.send(sanitizedData);
  } catch(e) {
    console.log(e)
    res.status(500);

    res.send({ message: "Whoops! Something went wrong...", error: e });
  }
});

app.get('/match-history/:summoner_name', async (req, res) => {
  try {
    // Map champion ID to champion name
    let matches = await matchStore.getMatchHistory(req.params.summoner_name);

    matches = matches.map((m) => {
        m.champion = Object.values(staticData.champions.data).filter((d) => {return d.key == m.champion});
        return m;
    });
    res.send(matches)
  } catch(e) {
      console.log(e);
    res.send({ message: 'Whoops! Something went wrong...', error: e })
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
  try {
    res.send(await matchStore.getRankForPlayerMatch(req.query.player, req.query.matchId, staticData));
  } catch(e) {
    console.log(e)
    res.send({status: 500})
  }
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
