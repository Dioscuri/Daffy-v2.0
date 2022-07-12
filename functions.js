const {google} = require('googleapis');
require("discord.js");


 //Fetches Data from a Sheet in a Spreadsheet
 const  fetchSheetData = async (auth, sheetID, seekRange) =>{
    const sheets = google.sheets({ version: 'v4', auth });
    const parameters = {spreadsheetId: sheetID, range:seekRange}

    let result = sheets.spreadsheets.values.get(parameters)
        .then(res => { 
            return res.data.values
        })
        .catch(error => {console.log(error)})
    return result
 }

 const profile = (receivedMessage, arguments) =>{
    const character = arguments
    if (character.role == "Servant"){                 
        const profileembed = {
            color: 0x0099ff,
            title : character.timeline + ' ' + character.role + " (" + character.class_container + "): ||"+ character.trueName +"||",
            description:`*Alignment: ${character.alignment ? character.alignment : "???"}*\n*Height: ${character.height ? `${character.height} cm` : "???"}*\n*Weight: ${character.weight ? `${character.weight} kg` : "???"}*\n*Attribute: ${character.attribute ? `${character.attribute}` : "???"}*`,

            thumbnail: {url: character.image,},
            fields: [
                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `STR: `, value: character.str ? character.str : 'N/A', inline: true,},
                { name: `END: `, value: character.end ? character.end : 'N/A', inline: true,},
                { name: `AGI: `, value: character.agi ? character.agi : 'N/A', inline: true,},

                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `MAG: `, value: character.mag ? character.mag : 'N/A', inline: true,},
                { name: `LCK: `, value: character.lck ? character.lck : 'N/A', inline: true,},
                { name: `NP: `, value: character.np && character.class_container != 'LBLancer'? character.np : '???', inline: true,},
            ]
        }
        receivedMessage.channel.send({embeds:[profileembed]})
    }

    else if (character.role == "Master" || character.role == "NPC"){    
        const profileembed = {
            color: 0x0099ff,
            title : character.role == "Master" ? `(${character.role} of ${character.servantClass}) -- ${character.fullName}` : `${character.fullName} `,
            description: `*Alignment: ${character.alignment ? character.alignment : "???"}*\n*Height: ${character.height ? `${character.height} cm` : "???"}*\n*Weight: ${character.weight ? `${character.weight} kg` : "???"}*\n*Age: ${character.age ? `${character.age} years` : "???"}*`,

            thumbnail: {url: character.image,},
            fields: [
                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `STR: `, value: character.str ? character.str : 'N/A', inline: true,},
                { name: `END: `, value: character.end ? character.end : 'N/A', inline: true,},
                { name: `AGI: `, value: character.agi ? character.agi : 'N/A', inline: true,},

                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `MAG: `, value: character.mag ? character.mag : 'N/A', inline: true,},
                { name: `LCK: `, value: character.lck ? character.lck : 'N/A', inline: true,},

                {name: '\u200b',
                value: '\u200b',
                inline: false,},

                { name: `INT: `, value: character.int ? character.int : 'N/A', inline: true,},
                { name: `CHAR: `, value: character.char ? character.char : 'N/A', inline: true,},
            ]
        }
        
        receivedMessage.channel.send({embeds:[profileembed]})
    }
}


 module.exports = {
    profile: function(receivedMessage,arguments){return profile(receivedMessage,arguments)},
    fetchSheetData: function(auth, sheetID, seekRange) {return fetchSheetData(auth, sheetID, seekRange)},
 };