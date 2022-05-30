import { ICommand } from "wokcommands";
import DiscordJS, { ApplicationCommand, CommandInteractionOptionResolver, Intents, Interaction, Message, MessageEmbed, User } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import axios from 'axios';
import { format } from "morgan";
const bancho_url = `c.chronoskia.com`
const chronoapi_url = `osu.chronoskia.com/chronoapi`
const base_url = `osu.chronoskia.com`
export default {
    category: 'Test',
    description: 'Bancho status',
    options: [
        {
            name: 'bancho',
            description: 'displays pep.py status',
            type: 'BOOLEAN',
            required: true
        },
        {
            name: 'LETS',
            description: 'displays LETS status',
            type: 'BOOLEAN',
            required: true
        },
        {
            name: 'API',
            description: 'displays chronoapi status',
            type: 'BOOLEAN',
            required: true
        }

    ], 
    slash: true,
    testOnly: true,
    callback: async ({ message, interaction, args, user}) => {
        try {
            // check if api is online
            var {data} = await axios.get(
                `${chronoapi_url}`);
            
            var status = data.status

            if (!status){
                Error
                console.log(`API is offline`)
            }
             // check if bancho is online
             var response = await fetch(`${bancho_url}`)
             console.log(`${response.status}`)
             const bancho_status = {
                "Online" : 200,
                "Offline" : null
            }
            var bancho_on = ``
            if (!response.status){
                bancho_status.Offline
                console.log(`Bancho is offline`)
            }else if (response.status >= bancho_status.Online){
                console.log(`Bancho is online`)
                bancho_on = `Online`
            }
           // check if LETS is offline or online. kinda sad how the admin panel still cant do this simple thing
          // too lazy to finish :/

            try {
                const embed = new MessageEmbed()
                .setAuthor({name: `Server Status`, iconURL: `${base_url}/static/images/icon.png`})
                .setColor(`#aa3399`)
                .setThumbnail(`https://www.google.com/url?sa=i&url=http%3A%2F%2Fwww.clker.com%2Fclipart-245699.html&psig=AOvVaw0u7TTV5lQaR-rpYYsA3ZTQ&ust=1653937127689000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCNDRmoyyhfgCFQAAAAAdAAAAABAD`)
                .setDescription(`Displays the status of the server`)
                .addFields(
                    {name: `ChronoAPI Status:`, value: `${status}`},
                    {name: `Bancho Status:`, value: `${bancho_on}`}
                    //{name: `LETS Status:`, value: `${LETS_status}`} rather not 

                )
                .setFooter({text: `Chronoskia server status`, iconURL:`${base_url}/static/images/icon.png`})
                return embed;
          
            } catch{
                const error = `Server is offline`
                const embed = new MessageEmbed()
                .setTitle(`ERROR: ${error}`)
                .setColor(`RED`)
                .setDescription(`${error}`)
            return embed;
            }

        } catch {}
    }
}
