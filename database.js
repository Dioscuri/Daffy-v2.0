const { fetchSheetData } = require('./functions')

// Functions for fetching data from Google Sheets
const fetchServantData = async () => await fetchSheetData(process.env.GOOGLE_KEY, process.env.SHEET_ID, 'Servants!A3:N')
const fetchMasterData = async ()  => await fetchSheetData(process.env.GOOGLE_KEY, process.env.SHEET_ID, 'Masters!A3:P')
const fetchNpcData = async () => await fetchSheetData(process.env.GOOGLE_KEY, process.env.SHEET_ID, 'NPCs!A3:O')
const fetchPlayerData = async () => await fetchSheetData(process.env.GOOGLE_KEY, process.env.SHEET_ID, 'Players!A3:E')

// Helper functions for constructing objects representing sheet data.
// Note: all objects possess a 'name' property. In case we want to add more categories, 
// they should probably possess a 'name' property as well.
const constructServantProfile = (servant) => {
  return {
    name: servant[0],
    trueName: servant[1],
    role: 'Servant',
    alignment: servant[2] ? servant[2] : '???',
    timeline: servant[3]  ? servant[3] : '???',
    str: servant[4] >= 0 ? `+${servant[4]}` : `${servant[4]}`,
    end: servant[5] >= 0 ? `+${servant[5]}` : `${servant[5]}`,
    agi: servant[6] >= 0 ? `+${servant[6]}` : `${servant[6]}` ,
    mag: servant[7] >= 0 ? `+${servant[7]}` : `${servant[7]}`,
    lck: servant[8] >= 0 ? `+${servant[8]}` : `${servant[8]}`,
    np:  servant[9] >= 0 ? `+${servant[9]}` : `${servant[9]}`,
    height: servant[10] ? servant[10] : '???',
    weight: servant[11] ? servant[11] : '??',
    attribute: servant[12]? servant[12] : '???',
    image: servant[13] ? new URL(servant[13]) : null,
  }
}

const constructMasterProfile = (master) => {
  return {
    name: master[0],
    fullName: master[1] ? master[1] : '???',
    alignment: master[2] ? master[2] : '???',
    servantClass:  master[3] ? master[3] : '???',
    timeline: master[4] ? master[4] : '???',
    role: 'Master',

    str: master[5] >= 0 ? `+${master[5]}` : `${master[5]}`,
    end: master[6] >= 0 ? `+${master[6]}` : `${master[6]}`,
    agi: master[7] >= 0 ? `+${master[7]}` : `${master[7]}`,
    mag: master[8] >= 0 ? `+${master[8]}` : `${master[8]}`,
    lck: master[9] >= 0 ? `+${master[9]}` : `${master[9]}`,
    int: master[10] >= 0 ? `+${master[10]}` : `${master[10]}`,
    char: master[11] >= 0 ? `+${master[11]}` : `${master[11]}`,

    height: master[12] ? master[12] : '???',
    weight: master[13] ? master[13] : '???',
    age: master[14]? master[14] : '???',
    image: master[15] ?  new URL(master[15]) : null,
  }
}

const constructNpcProfile = (npc) => {
  return {
    name: npc[0],
    fullName: npc[1] ? npc[1] : '???',
    alignment: npc[2] ? npc[2] : '???',
    timeline:  npc[3] ? npc[3] : '???',
    role: 'NPC',

    str: npc[4] >= 0 ? `+${npc[4]}` : `${npc[4]}`,
    end: npc[5] >= 0 ? `+${npc[5]}` : `${npc[5]}`,
    agi: npc[6] >= 0 ? `+${npc[6]}` : `${npc[6]}`,
    mag: npc[7] >= 0 ? `+${npc[7]}` : `${npc[7]}`,
    lck: npc[8] >= 0 ? `+${npc[8]}` : `${npc[8]}`,
    int: npc[9] >= 0 ? `+${npc[9]}` : `${npc[9]}`,
    char: npc[10] >= 0 ? `+${npc[10]}` : `${npc[10]}`,

    height: npc[11] ? npc[11] : '???',
    weight: npc[12] ? npc[12] : '???',
    age: npc[13]? npc[13] : '???',
    image: npc[14] ?  new URL(npc[14]) : null,
  }
}

const constructPlayerProfile = (player) => {
  return {
    name: player[0],
    master: player[1] ? player[1] : 'N/A',
    servant: player[2] ? player[2] : 'N/A',
    timezone:  player[3] ? player[3] : 'N/A',
    lastRound: player[4] ? player[4] : 'N/A',
  }
}

// Function for turning a 2d array of data into a map of objects using objFunc.
const generateMap = async (objFunc, data) => {
  const database_data = await data  
  let generatedMap = new Map(  
    database_data.map(
    (index) => {
      const obj = objFunc(index)
      return([obj['name'].toLowerCase(), obj])
  }))

  return generatedMap

}

module.exports = {
  players: generateMap(constructPlayerProfile, fetchPlayerData()),
  npcs: generateMap(constructNpcProfile, fetchNpcData()),
  servants: generateMap(constructServantProfile, fetchServantData()),
  masters: generateMap(constructMasterProfile, fetchMasterData()),
}