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
});
const playerStatsSchema = new mongoose.Schema({
    internalRanking: Number,
    riotClientRanking: String,
    userRating: Number,
    championId: Number,
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

module.exports = {
    getMatch: async (matchId) => {
        await init();
        let match = await Match.findOne({getMatchId: matchId});

        if (match) {
            return match;
        }

        match = await kayn.Match.get(matchId);

        const matchDto = new Match(match);
        await matchDto.save();

        return matchDto.toJSON();
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
    }
};
