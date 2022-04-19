const { StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const {Routes} = require("discord-api-types/v9");
const {REST} = require("@discordjs/rest");
const {Client, MessageEmbed} = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const Week = require('../models/Week');
const Leaderboard = require('../models/Leaderboard');
const Track = require("../models/Track");

module.exports = {
    name: "ready",
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    execute(client, commands) {

        setInterval(async () => {

            try { 

                const url = 'https://prod.radio-api.net/stations/now-playing?stationIds=skyrock';
                let request = await axios.get(url).then(res => res.data[0].title);
    
                if(!request.startsWith('SKYROCK')) request = request.slice(0, -9);
    
                client.user.setActivity(request, { type: "LISTENING" });
    
            } catch(e) {

                client.user.setActivity("SKYROCK", { type: "LISTENING" });

            }

            const date = new Date();
            
            const week = await Week.findOne();
            const day = date.toLocaleDateString('fr-FR', { day: 'numeric' });
            const weekday = date.toLocaleDateString('fr-FR', { weekday: 'long' });

            if(weekday == 'lundi' && day == week.lastChanged + 7) {

                week.updateOne({

                    week: week.week + 1,
                    lastChanged: day

                }).then(res => console.log('New Week'))
                .catch(err => console.log(err));

                const weekNumber = await week.week;

                new Leaderboard({

                    week: weekNumber + 1,
                    sent: false
    
                }).save().catch(err => console.log(err));

            };

            const leaderboards = await Leaderboard.findOne({ week: week.week });

            if(weekday == 'lundi' && leaderboards.sent == false) {

                client.leaderboards(client, 'single', "957656059303059476");
                client.leaderboards(client, 'album', "957656059303059476");
                leaderboards.updateOne({ sent: true }).catch(err => console.log(err));

            }
 
        }, 10 * 1000);  

        const rest = new REST({ version: "9"}).setToken(process.env.TOKEN);

        (async () => {

            try {

                if(process.env.ENV === 'production') {

                    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                        body: commands
                    }).then(console.log('[+] Registered commands'));

                } else {

                    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
                        body: commands
                    }).then(console.log('[+] Registered commands'));

                    try {

                        const connection = joinVoiceChannel({
                            channelId: "957659615963799552",
                            guildId: process.env.GUILD_ID,
                            adapterCreator: client.guilds.cache.get(process.env.GUILD_ID).voiceAdapterCreator,
                        });
            
                        const resource = createAudioResource('http://icecast.skyrock.net/s/natio_mp3_128k', { inputType: StreamType.Arbitrary });
                        const player = createAudioPlayer();
            
                        player.play(resource);
                        connection.subscribe(player);

                        console.log('[+] Skyrock playing');

                    } catch(e) { console.log(e); }

                    console.log('[+] Punchbot');

                }

            } catch (e) { console.error(e); }

        })();

    }
}