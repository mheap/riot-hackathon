const riotApiHelper = require("./riotApiHelper");
const mongoose = require('mongoose');
const { Kayn } = require('kayn');

const kayn = Kayn()();

const playerSchema = new mongoose.Schema({
    summonerName: String,
    summonerId: Number,
    currentAccountId: Number,
    profileIcon: Number,
});
const participantIdSchema = new mongoose.Schema({
    player: [playerSchema],
    participantId: Number,
});
const participantStatsSchema = new mongoose.Schema({
    firstBloodKill: Boolean,
    firstBloodAssist: Boolean,
    visionScore: Number,
    magicDamageDealtToChampions: Number,
    damageDealtToObjectives: Number,
    totalTimeCrowdControlDealt: Number,
    longestTimeSpentLiving: Number,
    tripleKills: Number,
    kills: Number,
    neutralMinionsKilled: Number,
    largestMultiKill: Number,
    totalUnitsHealed: Number,
    wardsKilled: Number,
    largestKillingSpree: Number,
    quadraKills: Number,
    teamObjective: Number,
    magicDamageDealt: Number,
    item0: Number,
    item1: Number,
    item2: Number,
    item3: Number,
    item4: Number,
    item5: Number,
    item6: Number,
    neutralMinionsKilledTeamJungle: Number,
    neutralMinionsKilledEnemyJungle: Number,
    damageSelfMitigated: Number,
    magicalDamageTaken: Number,
    trueDamageTaken: Number,
    assists: Number,
    goldSpent: Number,
    trueDamageDealt: Number,
    participantId: Number,
    totalDamageTaken: Number,
    physicalDamageDealt: Number,
    sightWardsBoughtInGame: Number,
    totalDamageDealtToChampions: Number,
    physicalDamageTaken: Number,
    totalDamageDealt: Number,
    deaths: Number,
    wardsPlaced: Number,
    turretKills: Number,
    trueDamageDealtToChampions: Number,
    goldEarned: Number,
    killingSprees: Number,
    unrealKills: Number,
    firstTowerAssist: Boolean,
    firstTowerKill: Boolean,
    champLevel: Number,
    doubleKills: Number,
    inhibitorKills: Number,
    firstInhibitorAssist: Boolean,
    visionWardsBoughtInGame: Number,
    pentaKills: Number,
    totalHeal: Number,
    totalMinionsKilled: Number,
    timeCCingOthers: Number,
});
const participantTimelineSchema = new mongoose.Schema({
    lane: String,
    participantId: Number,
    role: String,
    csDiffPerMinDeltas: {
        type: Map,
        of: Number,
    },
    goldPerMinDeltas: {
        type: Map,
        of: Number,
    },
    xpDiffPerMinDeltas: {
        type: Map,
        of: Number,
    },
    creepsPerMinDeltas: {
        type: Map,
        of: Number,
    },
    xpPerMinDeltas: {
        type: Map,
        of: Number,
    },
    damageTakenDiffPerMinDeltas: {
        type: Map,
        of: Number,
    },
    damageTakenPerMinDeltas: {
        type: Map,
        of: Number,
    },
});
const participantSchema = new mongoose.Schema({
    stats: participantStatsSchema,
    teamId: Number,
    participantId: Number,
    timeline: participantTimelineSchema,
    championId: Number
});
const matchSchema = new mongoose.Schema({
    seasonId: Number,
    queueId: Number,
    gameId: Number,
    participantIdentities: [participantIdSchema],
    participants: [participantSchema],
    platformId: String,
    gameDuration: Number,
    calculatedGameScore: Boolean
});
const playerStatsSchema = new mongoose.Schema({
    internalRanking: Number,
    riotClientRanking: String,
    matchId: Number,
    userRating: Number,
    championId: Number,
    summonerName: String,
    match: [matchSchema],
    playerIdentity: [playerSchema]
});
const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    timestamp: Date,
    matchId: Number
});
const champBaseline = new mongoose.Schema({
    championId: Number,
    position: String,
    queueType: String,
    rankTier: String,
    csDiffAtLaningEnd: Number,
    csPerMinute: Number,
    damagePerDeath: Number,
    damagePerGold: Number,
    damageShare: Number,
    goldDiffAtLaningEnd: Number,
    kda: Number,
    killConversionRatio: Number,
    killParticipation: Number,
    objectiveControlRatio: Number,
    roamDominanceScore: Number,
    utilityScore:  Number,
    visionScorePerHour:  Number,
});

const Match = mongoose.model('Match', matchSchema);
const PlayerStats = mongoose.model('PlayerStats', playerStatsSchema);

const init = async () => {
    if (init.done !== undefined) {
        return;
    }

    init.done = true;
    console.log('connecting to mongo...');
    await mongoose.connect('mongodb://database/match');
    console.log('connected!');
}

const getMatch = async (matchId) => {
    await init();
    let match = await Match.findOne({gameId: matchId});

    if (match) {
        return match.toJSON();
    }

    console.log("Cache miss!");
    match = await kayn.Match.get(matchId);

    const matchDto = new Match(match);
    await matchDto.save();

    console.log('match', match)

    return matchDto.toJSON();
}

const sanitizeMatchDataForSummoner = async (gameData, summonerName, staticData) => {
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

  const getRankForSanitizedData = async (sanitizedData) => {
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

  const getRankForPlayerMatch = async (summonerName, matchId, staticData) => {
        await init();
        let _match = await PlayerStats.findOne({ summonerName, matchId });

        if (_match) {
            return _match.toJSON();
        }

        _match = await getMatch(matchId)
        const sanitizedData = await sanitizeMatchDataForSummoner(_match, summonerName, staticData)
        const rank = await getRankForSanitizedData(sanitizedData)

        const playerStats = new PlayerStats({
            internalRanking: rank,
            summonerName: summonerName,
            matchId: matchId,
            championId: sanitizedData.userParticipant[0].championId,
            _match: [_match],
            playerIdentity: [sanitizedData.playerIdentity]
        })

        await playerStats.save();

        return playerStats.toJSON();
    }

module.exports = {
    getMatch: getMatch,

    getMatchHistory: async (summonerName) => {
        const summoner = await kayn.Summoner.by.name(summonerName)
        return (await kayn.Matchlist.by.accountID(summoner.accountId)).matches
    },

    getLeaderboard: async (championId) => {
        await init();
        let leaderboard = await PlayerStats.find({ championId });

        return leaderboard;
    },

    setLeaderboard: async (player, matchId, championId) => {
        const obj = { player, matchId, championId };
        const playerStats = new PlayerStats(obj);
        await playerStats.save();

        return playerStats.toJSON();
    },

    startCalc: async (staticData) => {
        await init();
        while (true) {
            let _match = await Match.findOne({calculatedGameScore: { '$exists': false }})

            if (!_match) {
                return;
            }

            _match.participantIdentities.map(player => {

                return player.player[0].summonerName;
            }).forEach(summonerName => getRankForPlayerMatch(summonerName, _match.gameId, staticData));


        }
    },

    startSeed: async () => {
        let summoners = [
            "Derpthemeus",
            "rithms",
            "RndmInternetMan",
            "FatalElement",
            "TheMenEgg",
            "Earleking",
            "Vexrax",
            "PHP DEV BTW",
            "the gozaq",
            "Shoco",
            "aznchipmunk",
            "littleTinglan",
            "pseudonym117",
            "Kalturi",
            "WxWatch",
            "golang",
            "olysia",
            "Seep",
            "Before Sunrise",
            "Lord Imrhial",
            "OXStormthunder",
            "Tessticles",
            "idunnololz",
            "ImaAsheHole",
            "Ruer",
            "pwnallol",
            "koreanberry",
            "fine ill support",
            "natsy",
            "Felicious",
            "Scub3d",
            "chopov",
            "iamtreelynna",
            "Etirps",
            "Shiden",
            "TheNextFaker",
            "Riot Tuxedo",
            "Riot Git Gene",
            "Tuxedo",
            "Riot Schmick",
            "Riot Adobo",
        ]

        for (let i = 0; i < summoners.length; i++) {
            const summonerName = summoners[i]
            console.log(`loading matches for ${summonerName}...`)
            try {
                const summoner = await kayn.Summoner.by.name(summonerName)

                const matchlist = await kayn.Matchlist.by.accountID(summoner.accountId)

                for (let j = 0; j < matchlist.matches.length; j++) {
                    const match = matchlist.matches[j]
                    console.log(`loading match ${match.gameId}`)

                    try {
                        const matchDto = await getMatch(match.gameId)

                        const rioters = matchDto.participantIdentities
                            .map(p => p.player[0])
                            .filter(p => p.summonerName.toLowerCase().includes('riot'))

                        for (let k = 0; k < rioters.length; k++)    {
                            if (!summoners.includes(rioters[k].summonerName)) {
                                console.log(`Found rioter ${rioters[k].summonerName}!`)
                                summoners.push(rioters[k].summonerName)
                            }
                        }
                    } catch(e) {
                        console.log(`error! ${e}`)
                    }
                }
            } catch(e) {
                console.log(`error! ${e}`)
            }
        }

        console.log('finished seeding!')
    }
};
