const champData = require ('./champBaselines');

module.exports = {
  findChamp: (gameData, champions) => {
    let data;
    Object.keys(champions.data).forEach(champKey => {
      if (champions.data[champKey].key == gameData.userParticipant[0].championId) {
        data = champions.data[champKey];
      }
    })
    return data;
  },

  mapItems: (gameData, items) => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const str = `item${i}`;
      const itemId = gameData.userParticipant[0].stats[str].toString();
      arr.push(items.data[itemId]);
    }
    return arr;
  },

  rankStats: (rawData, champId) => {
    let internalScore = 0;
    let rawDataScore = 0;

    champData.champBaselines.forEach(champ => {
      if (champId === champ.ChampionId) {
        Object.keys(champ.StatsPerPosition[2].Stats).forEach(key => {
              internalScore += champ.StatsPerPosition[2].Stats[key];
        });
      }
    });

    Object.keys(rawData).forEach(key => {
      if (!isNaN(rawData[key])){
        rawDataScore += rawData[key]
      }
    });

    return rawDataScore / internalScore * 1000;
  }
};
