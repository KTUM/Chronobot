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
            // mod constants
            const _loggedMods = {
                "std": {
                    "EZ": 2,
                    "NF": 1,
                    "HT": 256,
                    "NM": 0,
            
                    "HR": 16,
                    "SD": 32,
                    "PF": 16384,
                    "DT": 64,
                    "NC": 512,
                    "HD": 8,
                    "FL": 1024,
            
                    "RX": 128,
                    "AP": 8192,
                    "SO": 4096,
                    "Auto": 0,
                    "Cinema": 0,
                    "ScoreV2": 0

                },
                "taiko": {
                    "EZ": 2,
                    "NF": 1,
                    "HT": 256,
            
                    "HR": 16,
                    "SD": 32,
                    "PF": 16384,
                    "DT": 64,
                    "NC": 512,
                    "HD": 8,
                    "FL": 1024,
            
                    "RX": 128,
                    "Auto": 0,
                    "Cinema": 0,
                    "ScoreV2": 0
                },
            
                "ctb": {
                    "EZ": 2,
                    "NF": 1,
                    "HT": 256,
            
                    "HR": 16,
                    "SD": 32,
                    "PF": 16384,
                    "DT": 64,
                    "NC": 512,
                    "HD": 8,
                    "FL": 1024,
            
                    "RX": 128,
                    "Auto": 0,
                    "Cinema": 0,
                    "ScoreV2": 0
                },
            
                "mania": {
                    "EZ": 2,
                    "NF": 1,
                    "HT": 256,
            
                    "HR": 16,
                    "SD": 32,
                    "PF": 16384,
                    "DT": 64,
                    "NC": 512,
                    "FI": 1048576,
                    "HD": 8,
                    "FL": 1024,
            
                    "K1": 0,
                    "K2": 0,
                    "K3": 0,
                    "K4": 32768,
                    "K5": 65536,
                    "K6": 131072,
                    "K7": 262144,
                    "K8": 524288,
                    "K9": 16777216,
            
            
                    "MR": 1073741824,
                    "RD": 0,
                    "Auto": 0,
                    "Cinema": 0,
                    "ScoreV2": 0
                }
            }
            // will add other mods later after i reformat code
            var mods = _loggedMods
            var std = mods.std
            var type_of_mod = ``
            if (scores[0].mods >= std.DT) {
                type_of_mod = `***DT***`
                console.log(`DT is selected`)
            }else if (scores[0].mods >= std.NM){
                type_of_mod = "***NM***"
                console.log(`No mods are selected`)
            }else if (scores[0].mods >= std.HR){
                type_of_mod = "***HR***"
                console.log(`Hardrock is selected`)
            }else if (scores[0].mods >= std.HD){
                type_of_mod = "***HD***"
                console.log(`Hidden is selected`)
            }else if (scores[0].mods >= std.HD + std.DT){
                type_of_mod = "***HDDT***"
                console.log(`Hidden DoubleTime is selected`)
            }else if (scores[0].mods >= std.RX){
                type_of_mod = "***RX***"
                console.log(`Relax is selected`)
            }else if (scores[0].mods >= std.FL){
                type_of_mod = "***FL***"
                console.log(`Flashlight is selected`)
            }
            // mode consts & detection
            const play_mode = {
                "std" : 0,
                "taiko": 1,
                "Ctb": 2,
                "mania": 3, 
            }
            var mode = ``
            if (scores[0].play_mode >= play_mode.std){
                mode = "Standard"
                console.log(mode)
            }else if (scores[0].play_mode >= play_mode.taiko){
                mode = "taiko"
                console.log(mode)
            }else if (scores[0].play_mode >= play_mode.mania){
                mode = "mania"
                console.log(mode)
            }else if (scores[0].play_mode >= play_mode.Ctb){
                mode = "catch"
                console.log(mode)
            } else {
                Error;
                
            }
   // ill fix the problem where HDDT mods are being a bitch and not showing up since i am restarting the server again after like 5 months
            try { 
                const embed = new MessageEmbed()
                .setAuthor({name: `${scores[0].beatmap.song_name} ⭐ ${star_rating}`, iconURL: `https://a.chronoskia.com/${id_check.id}`})
                .setColor(`#aa3399`)
                .setThumbnail(`https://b.ppy.sh/thumb/${scores[0].beatmap.beatmapset_id}l.jpg`)
                .setTitle(`Tap To Download`)
                .setURL(`https://osu.ppy.sh/beatmapsets/${scores[0].beatmap.beatmapset_id}`)
                .setDescription(`${response.username} set score on ${scores[0].beatmap.song_name}`)
                .addFields(
                    {name: `Gamemode`, value: `${mode}`},
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
