const {google} = require('googleapis');
require("discord.js");


 //Fetches Data from a Sheet in a Spreadsheet
module.exports.fetchSheetData = async (auth, sheetID, seekRange) =>{
    console.log("Fetching Data")
    const sheets = google.sheets({ version: 'v4', auth });
    const parameters = {spreadsheetId: sheetID, range:seekRange}

    const result = await sheets.spreadsheets.values.get(parameters)
        .then(res => { 
            return res.data.values
        })
        .catch(error => {console.log(error)})
    return result
 }

 module.exports.loadHP = (character) => {
    //Load Values
    const maxHP = parseInt(character.max_hp)
    const currHP = parseInt(character.curr_hp)

    const numGreen = Math.floor(currHP/maxHP * 10)

    const greenSquareID = '<:green_square:1003505885777252355>'
    const blackSquareID = '<:black_large_square:1003512814163468389>'

    const hpBar = []

    //HP Bar made of 10 squares
    for (let i = 0; i < 10; i++){
        if (i < numGreen){hpBar.push(greenSquareID)}
        else hpBar.push(blackSquareID)
    }

    return hpBar
 }


 module.exports.profile = (receivedMessage, arguments) =>{
    const character = arguments
    if (character.role == "Servant"){                 
        const profileembed = {
            color: 0x0099ff,
            title : character.timeline + ' ' + character.role + " (" + character.name + "): ||"+ character.trueName +"||",
            description:`*Alignment: ${character.alignment || "???"}*\n*Height: ${character.height || "???"} cm*\n*Weight: ${character.weight || "???"} kg*\n*Attribute: ${character.attribute || "???"}*`,

            thumbnail: {url: character.image,},
            fields: [
                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `STATUS: *${character.status || '???'}*`, value: `------------`, inline: false,},
                { name: `MAX HITPOINTS -- ${character.max_hp || '???'} hp`, value: `----------`, inline: false,},

                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `STR: `, value: character.str || 'N/A', inline: true,},
                { name: `END: `, value: character.end || 'N/A', inline: true,},
                { name: `AGI: `, value: character.agi || 'N/A', inline: true,},

                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `MAG: `, value: character.mag || 'N/A', inline: true,},
                { name: `LCK: `, value: character.lck || 'N/A', inline: true,},
                { name: `NP: `, value: character.np && character.class_container != 'LBLancer'? character.np : '???', inline: true,},
            ]
        }
        receivedMessage.channel.send({embeds:[profileembed]})
    }

    else if (character.role == "Master" || character.role == "NPC"){    
        const profileembed = {
            color: 0x0099ff,
            title : character.role == "Master" ? `(${character.role} of ${character.servantClass}) -- ${character.fullName}` : `${character.fullName} `,
            description: `*Alignment: ${character.alignment || "???"}*\n*Height: ${character.height || "???"} cm*\n*Weight: ${character.weight || "???"} kg*\n*Age: ${character.age || "???"} years*`,

            thumbnail: {url: character.image,},
            fields: [
                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `STATUS: *${character.status || '???'}*`, value: `------------`, inline: false,},
                { name: `MAX HITPOINTS -- ${character.max_hp || '???'} hp`, value: `-----------`, inline: false,},

                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `STR: `, value: character.str ||'N/A', inline: true,},
                { name: `END: `, value: character.end || 'N/A', inline: true,},
                { name: `AGI: `, value: character.agi || 'N/A', inline: true,},

                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `MAG: `, value: character.mag || 'N/A', inline: true,},
                { name: `LCK: `, value: character.lck || 'N/A', inline: true,},

                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `INT: `, value: character.int || 'N/A', inline: true,},
                { name: `CHAR: `, value: character.char || 'N/A', inline: true,},
            ]
        }
        
        receivedMessage.channel.send({embeds:[profileembed]})
    }
}


