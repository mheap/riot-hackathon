
const mongoose = require('mongoose')
const { Kayn } = require('kayn')

const kayn = Kayn()()

const playerSchema = new mongoose.Schema({
    summonerName: String,
    summonerId: Number,
    currentAccountId: Number,
    profileIcon: Number,
})
const participantIdSchema = new mongoose.Schema({
    player: [playerSchema],
    participantId: Number,
})
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
})
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
})
const participantSchema = new mongoose.Schema({
    stats: participantStatsSchema,
    participantId: Number,
    timeline: participantTimelineSchema,
    championId: Number
})
const matchSchema = new mongoose.Schema({
    seasonId: Number,
    queueId: Number,
    gameId: Number,
    participantIdentities: [participantIdSchema],
    participants: [participantSchema],
    platformId: String,
})

const Match = mongoose.model('Match', matchSchema)

const init = async () => {
    if (init.done !== undefined) {
        return
    }

    init.done = true
    console.log('connecting to mongo...')
    await mongoose.connect('mongodb://database/match')
    console.log('connected!')
}

module.exports = {
    getMatch: async (matchId) => {
        await init()
        await Match.findOneAndDelete({gameId: matchId})
        let match = await Match.findOne({gameId: matchId})

        if (match) {
            return match
        }

        match = await kayn.Match.get(matchId)

        const matchDto = new Match(match)
        await matchDto.save()

        return matchDto
    },
};
  