import { ICommand } from "wokcommands";
import DiscordJS, { ApplicationCommand, CommandInteractionOptionResolver, Intents, Interaction, Message, MessageEmbed, User } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import axios from 'axios';
import { format } from "morgan";
const base_url = 'https://osu.chronoskia.com'
export default {
    category: 'Trolling',
    description: 'Profile Data',
    options: [
        {
            name: 'username',
            description: 'Chronoskia Username',
            required: true,
            type: 'STRING'
        },
        {
            name: 'relax',
            description: 'Relax',
            required: false,
            type: 'BOOLEAN'
        },
        {
            name: 'standard',
            description: 'Standard',
            required: false,
            type: 'BOOLEAN'
        },
        {
            name: 'mania',
            description: 'Mania',
            required: false,
            type: 'BOOLEAN'
        },
        {
            name: 'catchthebeat',
            description: 'Catch the beat',
            required: false,
            type: 'BOOLEAN'
        },
    ],
    slash: true,
    testOnly: true,
    callback : async ({ message, interaction, args, user }) => {
        try {
            var { data } = await axios.get(`${base_url}/api/v1/users/whatid?name=${args.shift()}`)
            var response_code = data.code
            var id_check = data
            console.log(id_check)
            if (!id_check.id) {
                Error
            }
            var { data } = await axios.get(`${base_url}/api/v1/users/full?id=` + id_check.id)
            var response = data
            var type_of_playtime = ''
            if (response.std.play_time >= 86400) {
                type_of_playtime = 'Hours'
            } else if (response.std.play_time >= 3600) {
                type_of_playtime = 'Minutes'
            } else {
                type_of_playtime = 'Seconds'
            }
            var playtime = response.std.play_time / 60
            if (playtime >= 60) {
                playtime = (playtime / 60)
            }

           
            //aka check
            var if_aka
            if (!response.username_aka) {
                if_aka = ''
            } else {
                if_aka = `AKA ${response.username_aka}`
            }
            var final_playtime = playtime.toPrecision(3)
           
            const embed = new MessageEmbed()
                .setAuthor({name: `${response.username} ${if_aka}`, iconURL: `${base_url}/static`})
                .setColor(`#aa3399`)
                .setURL(`${base_url}/u/${id_check.id}`)
                .setThumbnail(`https://a.chronoskia.com/${id_check.id}`)
                .setFooter({text: `Chronoskia Osu server`, iconURL: `${base_url}/static/images/icon.png`})
                .addFields(
                    {name: `Rank:`, value: `#${response.std.global_leaderboard_rank}`},
                    {name: `Country Rank:`,  value:`:flag_${response.country.toLowerCase()}: #${response.std.country_leaderboard_rank} `},
                    {name: `Pp:`, value: `${response.std.pp}`},
                    {name: `Accuracy:`, value: `${response.std.accuracy.toFixed(2)}%`},
                    {name: `Playcount:`, value: `${response.std.playcount}`},
                    {name: `Total Hits:`, value: `${response.std.total_hits}`},
                    {name: `Playtime:`, value: `${final_playtime} ${type_of_playtime}`}
                )
               
            return embed
        } catch (error) {
            const embed = new MessageEmbed()
                .setTitle(`ERROR: ${error.response.status}`)
                .setColor(`RED`)
                .setDescription(error.response.data.message)
            return embed
        }
    }
} as ICommand
