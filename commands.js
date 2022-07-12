require("discord.js");

const roll = (receivedMessage,arguments) => {
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
                value: arguments.masterList.join(", "),
                //'iza, izarie, taipo, wilbur, emeria, westenra, west, finis, katya, grim, grimaud, egnilda, egni, calix, ava, daffy, daffodil, mei, dennis, siunaus, siu, penelope, pen, charmion, charm \n',
                inline: true,},

            {name: '**\nValid Command for Servants:**',
                value: arguments.servantList.join(", "),
                //'saber, archer, lancer, rider, caster, berserker, zerker, assassin, foreigner, ruler, johannes, john, yohannan, alterego, ae, lbsaber, lblancer, lbarcher, lbrider, lbcaster, lbassassin, lbass, lbberserker, lbzerker, lbzerk, avenger \n',
                inline: true,},

            {name: '\u200b',
                value: '\u200b',
                inline: false,},

            {name: '**\nValid Commands for NPCs:**',
                value: arguments.npcList.join(", "),
                inline: true,},

            {name: '\u200b',
                value: '\u200b',
                inline: false,},

            {name: '**\nGeneral Commands: \n**',
                value: arguments.commandList.join(", "),
                //'owo, culture, sparkle, height, age, weight, timezones',
                inline: true,},]
    }

    receivedMessage.channel.send({embeds:[helpembed]})
    receivedMessage.channel.send({embeds:[commandsEmbed]})
}

const height = (receivedMessage, heightList) => {
    const shorterFiveFeet = []
    const fiveToFiveSix = []
    const fiveSixToFiveTen = []
    const fiveTenToSix = []
    const sixAndUp = []

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

const weight = (receivedMessage, weightList) => {
    printList = []
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
        //'0.0 kg **Gabriel** \n 0.0 kg **Uriel** \n 0.0 kg **Raphael** \n 0.0 kg **Michael** \n 0.1 kg **Penelope** \n 32 kg **Daffodil** \n 42 kg **Siunaus** \n 45 kg **Sabine** \n 45 kg **Charmion** \n 46 kg **Li-Mei** \n 48 kg **Ava** \n 50 kg **Grimaud** \n 50 kg **Emeria** \n 52 kg **Westenra** \n 54 kg **Ruler** \n 57 kg **Katya** \n 59 kg **Egnilda** \n 60 kg **Taipo** \n 60 kg **LB Archer** \n 63 kg **Calix** \n 63 kg **Dennis** \n 65 kg **LB Lancer** \n 65 kg **Archer** \n 66 kg **Izarie** \n 66 kg **Alter Ego**  \n 71 kg **Saber** \n 73 kg **LB Saber** \n 74 kg **Wilbur** \n 74 kg **Caster** \n 76 kg **Lancer** \n 77 kg **LB Assassin** \n 78 kg **LB Zerker** \n 80 kg **Rider** \n 82 kg **Finis** \n 82 kg **Assassin**  \n 108 kg **Berserker** \n \n ??? **Foreigner**',
    }

    receivedMessage.channel.send({embeds:[weightEmbed]})
}

const age = (receivedMessage, ageList) => {
    const underTeen = []
    const teen = []
    const twenty = []
    const elderly = []

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

const timezones = (receivedMessage, playerList) => {
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
        //'GMT - 8  **Angie** \n GMT - 8  **Cheese** \n GMT - 8  **DasDokter** \n GMT - 8  **Lib** \n GMT - 8  **Venacyr** \n GMT - 8  **Yurae** \n \n GMT - 5  **Grizzly** \n  GMT - 5  **Rhye** \n GMT - 5  **Roach** \n  GMT - 5  **Silver** \n GMT - 5  **U.N. Owen** \n \n \n GMT + 0  **GreyWulfos** \n \n GMT + 1  **CT** \n GMT + 1  **Lupus** \n \n GMt + 7 **Termy** \n \n GMT + 8 **Shogun** \n GMT + 8 **Heliseus** \n \n GMT + 10  **Lempika** \n \n GMT + 11  **Akky** \n',
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

    height: function(receivedMessage, heightList){return height(receivedMessage, heightList)},
    weight: function(receivedMessage, weightList){return weight(receivedMessage, weightList)},
    age: function(receivedMessage, ageList){return age(receivedMessage, ageList)},
    timezones: function(receivedMessage, playerList){return timezones(receivedMessage, playerList)},

    culture: function(receivedMessage,arguments){return culture(receivedMessage,arguments)},
    sparkle: function(receivedMessage,arguments){return sparkle(receivedMessage,arguments)},
    sing: function(receivedMessage,arguments){return sing(receivedMessage,arguments)},
}