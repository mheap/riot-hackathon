const champions = [
  "Aatrox", "Ahri", "Akali", "Alistar", "Amumu", "Anivia", "Annie", "Ashe", "Aurelion Sol", "Azir", "Bard",
  "Blitzcrank", "Brand", "Braum", "Caitlyn", "Camille", "Cassiopeia", "Cho'Gath", "Corki", "Darius", "Diana", "Dr. Mundo", "Draven",
  "Ekko", "Elise", "Evelynn", "Ezreal", "Fiddlesticks", "Fiora", "Fizz", "Galio", "Gangplank", "", "Garen", "Gene", "Gnar", "Gragas", "Graves",
  "Hecarim", "Heimerdinger", "Illaoi", "Irelia", "Ivern", "","", "Janna", "Jarvan IV", "Jax", "Jayce", "Jhin", "Jinx", "Kai'Sa", "Kalista",
  "Karma", "Karthus", "","","", "Kassadin", "Katarina", "Kayle", "Kayn", "Kennen", "Kha'Zix", "Kindred", "Kled", "Kog'Maw", "LeBlanc", "","","","", "Lee Sin",
  "Leona", "Lissandra", "Lucian", "Lulu", "", "Lux", "Malphite", "Malzahar", "Maokai", "", "", "","","", "Master Yi", "Miss Fortune", "Mordekaiser", "Morgana", "",
  "Nami", "Nasus", "Nautilus", "Nidalee", "Nocturne", "","","","", "Nunu & Willump", "Olaf", "Orianna", "Ornn", "Pantheon", "Poppy", "Pyke", "Quinn",
  "Rakan", "Rammus", "","", "", "Rek'Sai", "Renekton", "Rengar", "Riven", "Rumble", "Ryze", "Sejuani", "Shaco", "Shen", "Shyvana", "","", "Singed", "Sion",
  "Sivir", "Skarner", "Sona", "Soraka", "Swain", "Syndra", "Tahm Kench", "Taliyah", "", "Talon", "Taric", "Teemo", "Thresh", "Tristana", "Trundle",
  "Tryndamere", "Twisted Fate", "Twitch", "Udyr", "Urgot" , "Varus", "Vayne", "Veigar", "Vel'Koz", "Vi", "Viktor", "Vladimir", "Volibear",
  "Warwick", "Wukong", "Xayah", "Xerath", "Xin Zhao", "Yasuo", "Yorick", "Zac", "Zed", "Ziggs", "Zilean", "Zoe", "Zyra"
];

function profileImage(name) {
  if (!name) {
    return "";
  }

  if (name === 'Gene') {
    return "https://i.imgur.com/ZAfmXoO.jpg";
  }

  // Remove disallowed characters
  name = name.replace(/(\.|'| )/g, "");

  var championURLs = {
    "Wukong" : "MonkeyKing",
    "LeBlanc" : "Leblanc",
    "ChoGath" : "Chogath",
    "KhaZix" : "Khazix",
    "KaiSa" : "Kaisa",
    "Nunu&Willump" : "Nunu",
    "VelKoz" : "Velkoz"
  }

  name = championURLs[name] || name;
  return "https://ddragon.leagueoflegends.com/cdn/8.22.1/img/champion/" + name + ".png";
}

export {champions, profileImage}
