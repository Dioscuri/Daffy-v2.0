const data = require('./database') 

const servantList = [...data.servants.values()]
const masterList = [...data.masters.values()]
const npcList = [...data.npcs.values()]
const playerList = [...data.players.values()] 

const roll = (receivedMessage, arguments) => {
    console.log(`Rolling: ${arguments.sentArgs} \n`)
    let roll = " " + arguments.sentArgs
        roll = roll.substring(1)
    let splitroll = roll.split("d")
    let dice_numberstr = splitroll[0]
    let sidesarr = splitroll[1]
    let modifierarr = [];

    const options = arguments.options

    if (!sidesarr){ 
        receivedMessage.channel.send("Error! Must include number of sides in a dice roll")
        return
    }
    if (!dice_numberstr){ 
        receivedMessage.channel.send("Error! Must include number of dice in a dice roll")
        return
    }

    if(sidesarr.includes("+")){modifierarr = sidesarr.split("+")}
    else if(sidesarr.includes("-")){modifierarr = sidesarr.split("-")}
    else{modifierarr=[sidesarr]}

    let sidesstr = modifierarr[0]
    let modifierstr = modifierarr[1]

    dice_number= parseInt(dice_numberstr,10)
    sides= parseInt(sidesstr,10)

    if (modifierstr){
        modifier= parseInt(modifierstr,10) + 0
    }
    else {modifier =0}


    if(sidesarr.includes("-")){
        modifier=modifier*-1
    }
    
    else if (sidesarr.includes("+")){
        modifier=modifier
    }


    total = 0
    total_list = []

    for (let i=0; i<dice_number; i++){
        const dice = Math.floor(Math.random() * ((sides - 1) + 1) + 1)
        total_list.push(dice)
        total=total + dice
    }

    dice_value=total
    total= total + modifier

    let dicePrint = []
    for (let i = 0; i < total_list.length; i++){
        if (i == total_list.length - 1){dicePrint.push(`${total_list[i]}`)}
        else dicePrint.push(`${total_list[i]} + `)
    }

    if (!total){return}

    const normalrollembed ={
        color: 0x0099ff,
        title : !options ? 'DICE ROLL' : `${options.name} ${options.stat.toUpperCase()} DICE ROLL`,
        fields: [
            { name: 'Total: ',
                value: `${total_list.join(' + ')} + ${modifier} = **${String(total) ? String(total) : 'N/A'}**`,},


            {name: 'Dice Total:',
                value: String(dice_value) ? String(dice_value) : 'N/A',
                inline: true,},

            {name: 'Modifier:',
                value: String(modifier) ? String(modifier) : 'N/A',
                inline: true,},]
    }
    const excellentBoundary = (dice_number * sides ) * .75 
    const goodBoundary = (dice_number * sides)* .6 
    const badBoundary = (dice_number * sides) * .3 

    if (total >= excellentBoundary){
        normalrollembed.color = 3066993
    }
    else if (total< excellentBoundary && total >= goodBoundary){
        normalrollembed.color = 1752220
    }
    else if (total<goodBoundary && total>=badBoundary){
        normalrollembed.color = 15105570
    }
    else if (total<badBoundary){
        normalrollembed.color = 15158332
    }

    receivedMessage.channel.send({embeds:[normalrollembed]})
}

const multiroll = (receivedMessage, arguments) => {
    let rolls = " " + arguments.sentArgs
        rolls = rolls.substring(1)
    console.log(rolls)

    let splitrolls = rolls.split(",").filter(element => element)
    console.log(splitrolls)

    for (i=0; i<splitrolls.length; i++){
        roll(receivedMessage, arguments = {
            sentArgs: splitrolls[i],
            options: null})
    }
}

const help = (receivedMessage, arguments) => {
    const helpembed = {
        color: 0x0099ff,
        title : ' **Command Examples**',
        description: '*"-" signals a command* \n *Note: You can only add one number (ex: +5) to a roll.*\n *Character Rolls use a 2d10 * \n  *Character Rolls cannot be modded* \n',
        fields: [

            { name: '**\nUniversal Stats: **',
                value: 'STR, END, AGI \n MAG, LCK \n',
                inline: true},

            { name: ' **\nNoble Phantasm:  **',
                value: 'NP \n',
                inline: true},
            
            { name: ' **\nMaster Additional Stats:  **',
                value: 'INT, CHAR \n',
                inline: true},


            {name: '\u200b',
                value: '\u200b',
                inline: false,},


            {name: ' **\nNormal Dice Roll:**',
                value: 'roll <# of die>d<sides> \n ex) -roll 1d20 \n ex) -roll 1d20+5 \n',
                inline: true,},

            {name: '\u200b',
                value: '\u200b',
                inline: true,},

            {name: '**\nMulti Rolls:**',
                value: 'multiroll <roll>, <roll> \n ex) -multiroll 1d20, 1d6+4 \n ex) -multiroll 1d20, 1d20+2, 1d15+1 \n',
                inline: true,},

            {name: '\u200b',
                value: '\u200b',
                inline: false,},

            {name: ' **\nProfiles:  **',
                value: '<name> profile or <name>\n ex) -calix profile \n ex) -calix \n',
                inline: true},

            {name: '**\nCharacter Rolls:**',
                value: '<name> <stat> \n ex) -foreigner str \n',
                inline: true,},

           /*{name: '\u200b',
                value: '\u200b',
                inline: false,},

            {name: '**\nAdvantage/Disadvantage:**',
                value: '<name> <stat or statsave> advantage\n <name> <stat or statsave> disadvantage\n ex) -foreigner magsave disadvantage\n ex) -foreinger str+2 advantage \n',
                inline: true,}*/,]
    }

    const commandsEmbed = {
        color: 0x32CD32,
        title : ' **Valid Commands **',
        description: '*List of Commands for Masters, Servants, NPCs, and General Commands* \n',
        fields: [

            {name: '**\nValid Commands for Masters:**',
                value: [...masterList.map((o) => o.name)].join(", "),
                inline: true,},

            {name: '**\nValid Command for Servants:**',
                value: [...servantList.map((o) => o.name)].join(", "),
                inline: true,},

            {name: '\u200b',
                value: '\u200b',
                inline: false,},

            {name: '**\nValid Commands for NPCs:**',
                value: [...npcList.map((o) => o.name)].join(", "),
                inline: true,},

            {name: '\u200b',
                value: '\u200b',
                inline: false,},

            {name: '**\nGeneral Commands: \n**',
                value: arguments.commandList.join(", "),
                inline: true,},]
    }

    receivedMessage.channel.send({embeds:[helpembed]})
    receivedMessage.channel.send({embeds:[commandsEmbed]})
}

const height = (receivedMessage) => {
    const shorterFiveFeet = []
    const fiveToFiveSix = []
    const fiveSixToFiveTen = []
    const fiveTenToSix = []
    const sixAndUp = []

    const genHeightObj = (o) => {
        return {
            name: o.name,
            height: parseFloat(o.height),
        }
    }

    const servantHeights = servantList.map(genHeightObj)
    const masterHeights = masterList.map(genHeightObj)
    const npcHeights = npcList.map(genHeightObj)
    const heightList = [...servantHeights, ...masterHeights, ...npcHeights]

    const sortedHeightList = heightList
        .filter(character => parseFloat(character.height))
        .sort((a,b)=>{return a.height - b.height})

    console.log(sortedHeightList)

    for (let i =0; i < sortedHeightList.length; i++){
        const character = sortedHeightList[i]
        if (character.height < 154.4){
            shorterFiveFeet.push(`${character.height} cm **${character.name}**\n`)}

        else if (character.height >= 154.4 && character.height < 167.6){
            fiveToFiveSix.push(`${character.height} cm **${character.name}**\n`)}

        else if (character.height >= 167.6 && character.height < 177.8){
            fiveSixToFiveTen.push(`${character.height} cm **${character.name}**\n`)}

        else if (character.height >= 177.8 && character.height < 182.9){
            fiveTenToSix.push(`${character.height} cm **${character.name}**\n`)}

        else if (character.height >= 182.9){
            sixAndUp.push(`${character.height} cm **${character.name}**\n`)}

    }

    const heightEmbed = {
        color: 0x0099ff,
        title : 'Height Rankings',
        description: `
        \n *—Below 5 feet—*\n${shorterFiveFeet.join("")}
        \n*—5 feet and up (152.4 cm)—*\n${fiveToFiveSix.join("")}
        \n*—5 feet 6 inches and up (167.6 cm)—*\n${fiveSixToFiveTen.join("")}
        \n*—5 feet 10 inches and up (177.8 cm)—*\n${fiveTenToSix.join("")}
        \n*— 6 feet and up (182.9 cm)—*\n${sixAndUp.join("")}
        `,
    }

    receivedMessage.channel.send({embeds:[heightEmbed]}) 
}

const weight = (receivedMessage) => {
    printList = []
    
    const genWeightObj = (o) => {
        return {
            name: o.name,
            weight: parseFloat(o.weight),
        }
    }

    const servantWeights = servantList.map(genWeightObj)
    const masterWeights = masterList.map(genWeightObj)
    const npcWeights = npcList.map(genWeightObj)
    const weightList = [...servantWeights, ...masterWeights, ...npcWeights]


    const sortedList = weightList
        .filter(character => parseFloat(character.weight))
        .sort((a,b) =>  a.weight - b.weight)
    
    for (let i =0; i < sortedList.length; i++){
        const character = sortedList[i]
        printList.push(`${character.weight} kg **${character.name}**\n`)
    }

    const weightEmbed = {
        color: 0x0099ff,
        title : `Characters' Weight List`,
        description: printList.join(""),
    }

    receivedMessage.channel.send({embeds:[weightEmbed]})
}

const age = (receivedMessage) => {
    const underTeen = []
    const teen = []
    const twenty = []
    const elderly = []

    const genAgeObj = (o) => {
        return {
            name: o.name,
            age: parseFloat(o.age),
        }
    }

    const masterAges = masterList.map(genAgeObj)
    const npcAges = npcList.map(genAgeObj)
    const ageList = [...masterAges, ...npcAges]

    const sortedAgeList = ageList
        .filter(character => parseInt(character.age))
        .sort((a,b)=>{return a.age - b.age})

    for (let i = 0; i < sortedAgeList.length; i++){
        const character = sortedAgeList[i]
        if (character.age < 13){
            underTeen.push(`${character.age} **${character.name}**\n`)}

        else if (character.age >= 13 && character.age <20){
            teen.push(`${character.age} **${character.name}**\n`)}

        else if (character.age >= 20 && character.age <30){
            twenty.push(`${character.age} **${character.name}**\n`)}

        else if (character.age >= 30){
            elderly.push(`${character.age} **${character.name}**\n`)}
    }

    const ageEmbed = {
        color: 0x0099ff,
        title : "Characters 'Age List",
        description: `
        \n *—The Kiddos—*\n${underTeen.join("")}
        \n*—The Teenagers—*\n${teen.join("")}
        \n*—The Roaring Twenties—*\n${twenty.join("")}
        \n*—The Elderly—* \n${elderly.join("")}
        `,
    }

    receivedMessage.channel.send({embeds:[ageEmbed]}) 
}

const timezones = (receivedMessage) => {
    printList = []
    const sortedPlayerList = playerList
        .filter(player => parseInt(player.timezone))
        .sort((a,b) => a.timezone - b.timezone)

    for (let i =0; i< sortedPlayerList.length; i++){
        const player = sortedPlayerList[i]
        printList.push(`GMT ${player.timezone > 0? `+${player.timezone}`: player.timezone}  **${player.name}**\n`)
    }
    const helpembed = {
        color: 3066993 ,
        title : 'Timezones',
        description: printList.join(""),
    }

    receivedMessage.channel.send({embeds:[helpembed]})
    
}

const culture = (receivedMessage, arguments) => {receivedMessage.channel.send('https://cdn.discordapp.com/emojis/663332858353549324.gif?v=1')}
const sparkle = (receivedMessage, arguments)=>{receivedMessage.channel.send('https://cdn.discordapp.com/emojis/646267054491435009.gif?v=1')}
const sing = (receivedMessage, arguments)=>{receivedMessage.channel.send('Never gonna give you up, Never gonna let you down, never gonna turn around and hurt you~') }


module.exports = {
    roll: function(receivedMessage,arguments){return roll(receivedMessage,arguments)},
    multiroll: function(receivedMessage,arguments){return multiroll(receivedMessage,arguments)},
    help: function(receivedMessage, arguments){return help(receivedMessage,arguments)},

    height: function(receivedMessage){return height(receivedMessage)},
    weight: function(receivedMessage){return weight(receivedMessage)},
    age: function(receivedMessage){return age(receivedMessage)},
    timezones: function(receivedMessage){return timezones(receivedMessage)},

    culture: function(receivedMessage,arguments){return culture(receivedMessage,arguments)},
    sparkle: function(receivedMessage,arguments){return sparkle(receivedMessage,arguments)},
    sing: function(receivedMessage,arguments){return sing(receivedMessage,arguments)},
}