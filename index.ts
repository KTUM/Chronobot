import DiscordJS, { ApplicationCommand, Intents, Interaction, Message, User } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import path from 'path'
const mongoose = require('mongoose')
dotenv.config()


const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
})
client.on('ready', () => {
    console.log('The bot is ready!')
    const guildId = '948886904131182643'
    const guild = client.guilds.cache.get(guildId)
    let commands
    const guild1 = `955939911402418236`

   if (guild) {
       commands = guild.commands
   } else {
       commands = client.application?.commands
   }
   new WOKCommands(client, {
       commandsDir: path.join(__dirname, 'commands'),
       typeScript: true,
       testServers: [guild1],
       mongoUri: '',
       dbOptions: {
           keepAlive: true,
       }
   })
})


client.login(process.env.TOKEN)
