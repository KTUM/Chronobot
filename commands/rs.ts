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
            // Star rating and pp fix
            var sr = scores[0].beatmap.difficulty          
            var star_rating = sr.toFixed(2)
            var pp = scores[0].pp
            var fixed_pp = pp.toFixed(2)
            /* for future reference
            enum Modes{
                "osu!" = 0,
                "Taiko" = 1,
                "CtB" = 2,
                "mania" = 3,

            }
            */
            // var mods = require(`./sebs_stuff/mods`)
            // mods
            var type_of_mod = ``
            if (scores[0].mods >= 64) {
                type_of_mod = `***DT***`
                console.log(`DT is selected`)
            }else if (scores[0].mods >= 0){
                type_of_mod = "***NM***"
                console.log(`No mods are selected`)
            }else if (scores[0].mods >= 15){
                type_of_mod = "***HR***"
                console.log(`Hardrock is selected`)
            }else if (scores[0].mods >= 8){
                type_of_mod = "***HD***"
                console.log(`Hidden is selected`)
            }else if (scores[0].mods >= 64 + 8){
                type_of_mod = "***HDDT***"
                console.log(`Hidden DoubleTime is selected`)
            }else if (scores[0].mods >= 128){
                type_of_mod = "***RX***"
                console.log(`Relax is selected`)
            }else if (scores[0].mods >= 1024){
                type_of_mod = "***FL***"
                console.log(`Flashlight is selected`)
            }
            try { 
                const embed = new MessageEmbed()
                .setAuthor({name: `${scores[0].beatmap.song_name} ⭐ ${star_rating}`, iconURL: `https://a.chronoskia.com/${id_check.id}`})
                .setColor(`#aa3399`)
                .setThumbnail(`https://b.ppy.sh/thumb/${scores[0].beatmap.beatmapset_id}l.jpg`)
                .setTitle(`Tap To Download`)
                .setURL(`https://osu.ppy.sh/beatmapsets/${scores[0].beatmap.beatmapset_id}`)
                .setDescription(`${response.username} set score on ${scores[0].beatmap.song_name}`)
                .addFields(
                    {name: `Mods`, value: `${type_of_mod}` },
                    {name: `Score`, value: `${scores[0].score}`},
                    {name: `Pp`, value: `${fixed_pp}` },
                    {name: `Misses`, value: `${scores[0].count_miss}`},
                    {name: `Combo`, value: `${scores[0].max_combo}/${scores[0].beatmap.max_combo}`}
                )
                .setFooter({text: `Set on Chronoskia Server`, iconURL:`${base_url}/static/images/icon.png`})
                return embed;
          
            } catch(error){
                const embed = new MessageEmbed()
                .setTitle(`ERROR: ${error.response.status}`)
                .setColor(`RED`)
                .setDescription(error.response.data.message)
            return embed;
                
            }
        }catch(error){
            console.log(error)
        }
    }    

} as ICommand
