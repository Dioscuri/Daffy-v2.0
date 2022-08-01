require('discord.js')
const validCommands = require('./commands.js')

module.exports.sing = (receivedMessage) => {validCommands.sing(receivedMessage)}
module.exports.nyoom = (receivedMessage) => {receivedMessage.channel.send("<:daffynyoom:762780988123250738>")}
module.exports.motivate = (receivedMessage) => {receivedMessage.channel.send("You can do it! <:daffynyoom:762780988123250738>")}