import { ICommand } from "wokcommands";
import DiscordJS, { ApplicationCommand, CommandInteractionOptionResolver, Intents, Interaction, Message, MessageEmbed, User } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import axios from 'axios';
import { format } from "morgan";
const base_url = 'https://osu.chronoskia.com'
const osuass_url = "https://assets.ppy.sh/beatmaps/"
export default {
    category: 'Test',
    description: 'Recent play',
    options: [
        {
            name: 'username',
            description: 'User identification',
            type: 'STRING',
            required: true
        }

    ], 
    slash: true,
    testOnly: true,
    callback: async ({ message, interaction, args, user}) => {
        try {
            var { data } = await axios.get(
                `${base_url}/api/v1/users/whatid?name=${args.shift()}`
            );
            var response_code = data.code;
            var id_check = data;
        
            console.log(id_check);
            if (!id_check.id) {
                Error;
            }
        
            var { data } = await axios.get(
                `${base_url}/api/v1/users/full?id=` + id_check.id
            );
        
            var response = data;
            var { data } = await axios.get(
                `${base_url}/api/v1/users/scores/recent?name=${response.username}&mode=0&l=1`
            );
            const scores = data.scores
            
            console.log(data.scores)
            var if_aka;
            if (!response.username_aka) {
                if_aka = "";
            } else {
                if_aka = `AKA ${response.username_aka}`;
            }
            try {
            
                const embed = new DiscordJS.MessageEmbed()
                .setAuthor({name: `${scores[0].beatmap.song_name} ⭐ ${scores[0].beatmap.difficulty}`, iconURL: `https://a.chronoskia.com/${id_check.id}`})
                .setColor(`#aa3399`)
                .setTitle(`Tap To Download`)
                .setURL(`${base_url}/b/${scores[0].id}`) 
                .setDescription(`${response.username} set score on ${scores[0].beatmap.song_name}`)
                .addFields(
                    {name: `Score`, value: `${scores[0].score}`},
                    {name: `Pp`, value: `${scores[0].pp}` },
                    {name: `Misses`, value: `${scores[0].count_miss}`}

                )
                .setFooter({text: `Set on Chronoskia Osu Server`, iconURL:`${base_url}/static/images/icon.png`})
                return embed;
                
               /*
                const embed = new MessageEmbed()
                    .setThumbnail(`https://a.chronoskia.com/${id_check.id}`)
                    .setDescription(
                        `${response.username}\n set score on ${scores[0].beatmap.song_name} worth ${scores[0].pp}\npp Score:${scores[0].score}\n Misses:${scores[0].count_miss}`
                    );
                return embed;
                */
            } catch (error) {
                const embed = new MessageEmbed()
                    .setTitle(`ERORR: ${response.error.status}`)
                    .setDescription(error.response.data.message);
                    console.log(error)
                return embed;
                
            }
        }catch(error){
            console.log(error)
        }
    }    

} as ICommand
