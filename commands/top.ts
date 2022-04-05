import { ICommand } from "wokcommands";
import DiscordJS, { ApplicationCommand, CommandInteractionOptionResolver, Intents, Interaction, Message, MessageEmbed, User } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import axios from 'axios';
import { format } from "morgan";
import { InviteTargetType } from "discord.js/typings/enums";
const base_url = 'https://osu.chronoskia.com';
const avatar_url = 'https://a.chornoskia.com'
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
            var { data } = await axios.get(
                `${base_url}/api/v1/users/scores/best?id=${id_check.id}&mode=0&l=1`
            );

            

            try{
                const embed = new MessageEmbed()
                    .setThumbnail(`https://a.chronoskia.com/${id_check}`)
                    .setDescription(`${response.username}\n Beatmap:${data.scores[0].beatmap.song_name}\nScore:${data.scores[0].score}\n Pp: ${data.scores[0].pp}  `)
                return embed;
            } catch (error){
                console.log(response.error)
            }

        } catch(error){
            console.log(error)
        }
    }
    

} as ICommand
