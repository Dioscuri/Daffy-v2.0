const main = async () =>{
    require("dotenv").config(); //to start process from .env file
    const {Client, Intents}=require("discord.js");
    const functions = require('./functions.js');
    const validCommands = require('./commands.js')

    const client=new Client({
        intents:[
            Intents.FLAGS.GUILDS,//adds server functionality
            Intents.FLAGS.GUILD_MESSAGES //gets messages from our bot.
        ]
    });


    client.on('ready', () => {
        console.log("Connected as " + client.user.tag)
        client.user.setActivity("-help for help")

        //Servers (Guilds) and Channels
        client.guilds.cache.forEach((guild) => {
            console.log(guild.name)
        /* guild.channels.cache.forEach((channel) =>{console.log(` - ${channel.name} ${channel.type} ${channel.id}`)})*/
        } )
    
    })

    //FETCHING DATA FROM GOOGLE SHEET
    const allServantProfiles = await functions.fetchSheetData(process.env.GOOGLE_KEY, process.env.SHEET_ID, 'Servants!A3:N')
    const allMasterProfiles = await functions.fetchSheetData(process.env.GOOGLE_KEY, process.env.SHEET_ID, 'Masters!A3:P')
    const allNPC = await functions.fetchSheetData(process.env.GOOGLE_KEY, process.env.SHEET_ID, 'NPCs!A3:O')
    const allPlayers = await functions.fetchSheetData(process.env.GOOGLE_KEY, process.env.SHEET_ID, 'Players!A3:E')

    //CONTAINERS FOR CHARACTERS AND PLAYERS
    let servantMap = new Map()
    let masterMap = new Map()
    let npcMap = new Map()

    const allServantContainers = []
    const allMasterNames = []
    const allNPCs = []

    const allCommands = Object.keys(validCommands)

    //PARSING RETRIEVED DATA
    allServantProfiles.forEach(servant => {
        //Gets all Servant Containers
        if (!servant[0] || servant[0] == ''){return}
        allServantContainers.push(servant[0].toLowerCase())

        //Set Key value Pairs according to the Servant Container
        servantMap.set(servant[0].toLowerCase(), 
        {
            class_container : servant[0],
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
        })
    })

    allMasterProfiles.forEach(master => {
        //Set Key value Pairs according to the Servant Container
        if (!master[0] || master[0] == ''){return}

        masterMap.set(master[0].toLowerCase(), 
        {
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
        })

        allMasterNames.push(master[0].toLowerCase())
    })

    allNPC.forEach(npc => {
        //Set Key value Pairs according to the Servant Container
        if (!npc[0] || npc[0] == ''){return}
        allNPCs.push(npc[0].toLowerCase())

        npcMap.set(npc[0].toLowerCase(), 
        {
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
        })
    })

    allPlayers.forEach(player => {
        if (!player[0] || player[0] == ''){return}

        allPlayersList.push( 
        {
            name: player[0],
            master: player[1] ? player[1] : 'N/A',
            servant: player[2] ? player[2] : 'N/A',
            timezone:  player[3] ? player[3] : 'N/A',
            lastRound: player[4] ? player[4] : 'N/A',
        })

    })

    //COMMAND HANDLERS
    const processCommand = (receivedMessage) =>{
        let fullCommand = receivedMessage.content.toLowerCase().substr(1)
        let splitCommand = fullCommand.split(" ")
        let primaryCommand = splitCommand[0]
        let arguments = splitCommand.slice(1)

        console.log("Command received: " + primaryCommand)
        console.log("Arguments: " + arguments + "\n")

        //Regular Commands Branch
        if (validCommands[primaryCommand]){
            if (primaryCommand == 'help'){
                validCommands[primaryCommand](receivedMessage, arguments = {
                        servantList: allServantContainers,
                        masterList: allMasterNames,
                        npcList: allNPCs,
                        commandList: allCommands,
                    })
            }

            else if (primaryCommand == 'height'){
                validCommands['height'](receivedMessage)
            }
            else if (primaryCommand == 'weight'){
                validCommands['weight'](receivedMessage)
            }
            else if (primaryCommand == 'age'){
                validCommands['age'](receivedMessage)
            }

            else if (primaryCommand == 'timezones'){
                validCommands['timezones'](receivedMessage)
            }

            //These are the rolls
            else validCommands[primaryCommand](receivedMessage, arguments={
                sentArgs: arguments,
                options: null
            })
        }
        //Servant Branch -- Check if the Servant is in the dict first
        else if (servantMap.get(primaryCommand)){
            const validStats = ['str', 'end', 'agi', 'mag', 'lck', 'np']
            const character = servantMap.get(primaryCommand)

            //Show Profile State
            if (arguments.length == 0 || arguments[0] == 'profile' || arguments[0] == 'showprofile'){
                functions.profile(receivedMessage, character)
            }
            //Stat Roll State
            else if(validStats.includes(arguments[0]) && character[arguments[0]]){
                validCommands.roll(receivedMessage, arguments ={
                    sentArgs:`2d10${character[arguments[0]]}${arguments[1] ? arguments[1] : ''}`,
                    options: {name: character.class_container, stat: arguments[0]}
                })
            }
            //Invalid State
            else {receivedMessage.channel.send(`Invalid Servant Command: ${arguments}`)}
        }

        //Master Branch
        else if (masterMap.get(primaryCommand)){
            const character = masterMap.get(primaryCommand)
            const validStats = ['str', 'end', 'agi', 'mag', 'lck', 'char', 'int']


            //Show Profile State
            if (arguments.length == 0 || arguments[0] == 'profile' || arguments[0] == 'showprofile'){
                functions.profile(receivedMessage, character)
            }
            //Stat Roll State
            else if(validStats.includes(arguments[0]) && character[arguments[0]]){
                validCommands.roll(receivedMessage, arguments ={
                    sentArgs:`2d10${character[arguments[0]]}${arguments[1] ? arguments[1] : ''}`,
                    options: {name: character.name, stat: arguments[0]}
                })
            }
            //Invalid State
            else {receivedMessage.channel.send(`Invalid Master Command: ${arguments}`)}
        }

        //NPC Branch
        else if (npcMap.get(primaryCommand)){
            const character = npcMap.get(primaryCommand)
            const validStats = ['str', 'end', 'agi', 'mag', 'lck', 'char', 'int']

            //Show Profile State
            if (arguments.length == 0 || arguments[0] == 'profile' || arguments[0] == 'showprofile'){
                functions.profile(receivedMessage, character)
            }
            //Stat Roll State
            else if(validStats.includes(arguments[0]) && character[arguments[0]]){
                validCommands.roll(receivedMessage, arguments ={
                    sentArgs:`2d10${character[arguments[0]]}${arguments[1] ? arguments[1] : ''}`,
                    options: {name: character.name, stat: arguments[0]}
                })
            }
            //Invalid State
            else {receivedMessage.channel.send(`Invalid NPC Command: ${arguments}`)}
        }

    }
    const processDaffybot = (receivedMessage) =>{
        let receivedMessagestr = "-" + receivedMessage.content
        let receivedMessagefinal = receivedMessagestr.substr(1)
        let argument = receivedMessagefinal.split(" ")
        let instruction = argument[1]

        console.log("Command received: " + receivedMessagefinal)
        console.log("Arguments: " + instruction)

        if (instruction=="sing"){validCommands.sing(receivedMessage, arguments)}
        else if (instruction=="nyoom"){receivedMessage.channel.send("<:daffynyoom:762780988123250738>")}
        else return
    }

    //MESSAGE EVENT LISTENER
    client.on('messageCreate', (receivedMessage) => {
        // Prevent bot from responding to its own messages
        if (receivedMessage.author == client.user) {return}

        //Command Handling
        else if (receivedMessage.content.startsWith("-")){processCommand(receivedMessage)}
        else if (receivedMessage.content.toLowerCase().startsWith("daffybot")){processDaffybot(receivedMessage)}

        //Fun Tidbits
        else if (receivedMessage.content.toLowerCase().startsWith('owo')){ 
            receivedMessage.channel.send("<:daffynyoomfast:762781000413347882>" + " OwO")}
        else if (receivedMessage.content.toLowerCase()=="aeuh"){
            receivedMessage.channel.send('<:lupus:762781102473084939>')}    
        else return
    })

    /* var sabine = {
        trueName: "Sabine",
        role: "???",
        class_container : "???",
        str: 1,
        end: 1,
        agi: 1,
        mag: 7,
        lck: 4,

        int: 4,
        char: 2,

        image: new URL(`https://cdn.discordapp.com/attachments/761415667051528193/805697146014662686/image0-6.png`)
    };*/

    //Login
    client.login(process.env.TOKEN) 
}
main();