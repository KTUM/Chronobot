import { ICommand } from "wokcommands";
import DiscordJS, { ApplicationCommand, CommandInteractionOptionResolver, Intents, Interaction, Message, MessageEmbed, User } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import axios from 'axios';
import { format } from "morgan";
import { InviteTargetType } from "discord.js/typings/enums";
const base_url = 'https://osu.chronoskia.com';
const avatar_url = 'https://a.chornoskia.com';
const gataribmap_url = 'https://osu.gatari.pw/d'
export default {
    category : "Osutop",
    description : "Shows top play",
    options: [
        {
            name : "username",
            description : "User identification",
            type : "STRING",
            required : true
        }
    ],
    slash: true,
    TestOnly: true,
    callback: async({ message, interaction, args, user}) => {
        try {
            var { data } = await axios.get(
                `${base_url}/api/v1/users/whatid?name=${args.shift()}`
            );
            var response_code = data.code;
            var id_check = data;
            var response = data
        
            console.log(id_check);
            if (!id_check.id) {
                Error;
            }
        
            var { data } = await axios.get(
                `${base_url}/api/v1/users/full?id=` + id_check.id
            );
            // nickname shit
            var if_aka
            if (!response.username_aka) {
                if_aka = ''
            } else {
                if_aka = `AKA ${response.username_aka}`
            }
            var { data } = await axios.get(
                `${base_url}/api/v1/users/scores/best?id=${id_check.id}&mode=0&l=1`
            );

            var scores = data.scores

            try{
                const embed = new MessageEmbed()
                .setAuthor({name: `${scores[0].beatmap.song_name} ⭐ ${Math.round(scores[0].beatmap.difficulty)}`, iconURL: `https://a.chronoskia.com/${id_check.id}`})
                .setColor(`#aa3399`)
                .setTitle(`Tap To Download`)
                .setURL(`${gataribmap_url}/${scores[0].beatmap.beatmapset_id}`)
                .setDescription(`${response.username} AKA ${if_aka} set score on ${scores[0].beatmap.song_name}`)
                .addFields(
                    {name: `Score`, value: `${scores[0].score}`},
                    {name: `Pp`, value: `${Math.round(scores[0].pp)}` },
                    {name: `Misses`, value: `${scores[0].count_miss}`},
                    {name: `Combo`, value: `${scores[0].max_combo}/${scores[0].beatmap.max_combo}`}

                )
                return embed;
            } catch (error){
                console.log(response.error)
            }

        } catch(error){
            console.log(error)
        }
    }
    

} as ICommand
