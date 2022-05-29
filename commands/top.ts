import { ICommand } from "wokcommands";
import DiscordJS, { ApplicationCommand, CommandInteractionOptionResolver, Intents, Interaction, Message, MessageEmbed, User } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import axios from 'axios';
import { format } from "morgan";
import { InviteTargetType } from "discord.js/typings/enums";
const base_url = 'https://osu.chronoskia.com';
const avatar_url = 'https://a.chornoskia.com';
const osu_url = `https://osu.ppy.sh/beatmapsets/`;
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
                console.error("no id")
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

            // Star rating and pp fix (not really obviously)
            var sr = scores[0].beatmap.difficulty          
            var star_rating = sr.toFixed(2)
            var pp = scores[0].pp
            var fixed_pp = pp.toFixed(2)

            try{
                const embed = new MessageEmbed()
                .setAuthor({name: `${scores[0].beatmap.song_name} ⭐ ${star_rating}`, iconURL: `https://a.chronoskia.com/${id_check.id}`})
                .setColor(`#aa3399`)
                .setTitle(`Tap To Download`)
                .setURL(`${osu_url}${scores[0].beatmap.beatmapset_id}`)
                .setThumbnail(`https://b.ppy.sh/thumb/${scores[0].beatmap.beatmapset_id}l.jpg`)
                .setDescription(`${response.username} set score on ${scores[0].beatmap.song_name}`)
                .addFields( 
                    {name: `Score`, value: `${scores[0].score}`},
                    {name: `Accuracy`, value:`${scores[0].accuracy`},
                    {name: `Pp`, value: `${fixed_pp}` },
                    {name: `Misses`, value: `${scores[0].count_miss}`},
                    {name: `Combo`, value: `${scores[0].max_combo}/${scores[0].beatmap.max_combo}`}

                )
                .setFooter({text: `Set on Chronskia Osu server`, iconURL: `${base_url}/static/images/icon.png`})
                return embed;
            } catch (error){
                console.log(response.error)
            }

        } catch(error){
            console.log(error)
        }
    }
    

} as ICommand
