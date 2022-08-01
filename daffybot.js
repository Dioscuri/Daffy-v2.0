//REQUIRED
require("dotenv").config(); //to start process from .env file
const {Client, Intents}=require("discord.js");
const functions = require('./functions.js');
const validCommands = require('./commands.js')
const daffyCommands = require('./daffybotCommands.js')
const data = require('./database.js')

COMMANDS = Object.keys(validCommands)
VALID_STATS_MAP = new Map([
    ["servant", ['str', 'end', 'agi', 'mag', 'lck', 'np']],
    ["npc", ['str', 'end', 'agi', 'mag', 'lck', 'char', 'int']],
    ["master", ['str', 'end', 'agi', 'mag', 'lck', 'char', 'int']]
]) 

const main = async () =>{
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
        } )
    
    })

    
    //COMMAND HANDLERS
    const processCommand = async (receivedMessage) =>{
        let fullCommand = receivedMessage.content.toLowerCase().substr(1)
        let splitCommand = fullCommand.split(" ")
        let primaryCommand = splitCommand[0]
        let arguments = splitCommand.slice(1)

        console.log("\n" + "Command received: " + primaryCommand)
        console.log("Arguments: " + arguments)

        const servants = await data.servants
        const masters = await data.masters
        const npcs = await data.npcs

        //Regular Commands Branch
        if (validCommands[primaryCommand]){
            validCommands[primaryCommand](
                receivedMessage, 
                arguments={
                    sentArgs: arguments,
                    options: null
                }
            )
        }

        //Characters Branch
        else{
            //Check if the command is a valid character with a map
            const character_type = (
                (servants).get(primaryCommand) ? "servant" : 
                (masters).get(primaryCommand) ? "master":
                npcs.get(primaryCommand) ? "npc":

                "Invalid"
            )

            if (character_type === "Invalid") {return}

            //Get character map
            const character_map = (
                (servants).get(primaryCommand) ? servants : 
                (masters).get(primaryCommand) ? masters:
                npcs
            )

            //Character Valid Stats based on the Character's type
            const validStats = VALID_STATS_MAP.get(character_type)
            const character = character_map.get(primaryCommand)

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
            else {receivedMessage.channel.send(`Invalid ${character_type} command: ${arguments}`)}
        }

        console.log("Command Processed.")
    }

    const processDaffybot = (receivedMessage) =>{
        let receivedMessagestr = "-" + receivedMessage.content
        let receivedMessagefinal = receivedMessagestr.substr(1)
        let argument = receivedMessagefinal.split(" ")
        let instruction = argument[1]

        console.log("Command received: " + receivedMessagefinal)
        console.log("Arguments: " + instruction)

        if (daffyCommands[instruction]){daffyCommands[instruction](receivedMessage)}
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