//REQUIRED
require("dotenv").config(); //to start process from .env file
const {Client, Intents}=require("discord.js");
const functions = require('./functions.js');
const validCommands = require('./commands.js')

//GLOBAL VARIABLES
AGE_LIST = []
HEIGHT_LIST = []
WEIGHT_LIST = []

COMMANDS = Object.keys(validCommands)

SERVANT_MAP = []
MASTER_MAP = []
NPC_MAP = []
PLAYER_MAP = []

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

    //Load Data from Sheet
    validCommands["load"]()

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
            //Do nothing for now since AllPlayersList still needs to be fixed
             if (primaryCommand == 'timezones'){
                return
                //validCommands['timezones'](receivedMessage, allPlayersList)
            }

        else validCommands[primaryCommand](receivedMessage, arguments={
                sentArgs: arguments,
                options: null
            })
        }
        //Servant Branch -- Check if the Servant is in the dict first
        else if (SERVANT_MAP.get(primaryCommand)){
            const validStats = ['str', 'end', 'agi', 'mag', 'lck', 'np']
            const character = SERVANT_MAP.get(primaryCommand)

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
        else if (MASTER_MAP.get(primaryCommand)){
            const character = MASTER_MAP.get(primaryCommand)
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
        else if (NPC_MAP.get(primaryCommand)){
            const character = NPC_MAP.get(primaryCommand)
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