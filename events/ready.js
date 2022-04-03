const {REST} = require("@discordjs/rest");
const axios = require('axios');
const {Routes} = require("discord-api-types/v9");
const {
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

require('dotenv').config();

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {

        // const rappeurs = [
        //     "Zola",
        //     "Laylow",
        //     "Josman",
        //     "Larry",
        //     "Niska",
        //     "Stromae",
        //     "Leto",
        //     "Nihno",
        //     "Orelsan",
        //     "SCH",
        //     "Naps",
        //     "Gazo",
        //     "Luv Resval",
        //     "Dinos",
        //     "Damso",
        //     "Nahir",
        //     "1Pliké140",
        //     "Freeze Corleone",
        //     "Aya Nakamura",
        //     "Clara Luciani",
        //     "OBOY",
        //     "PLK",
        //     "Djadja & Dinaz",
        //     "Marwa Loud",
        //     "Ziak",
        //     "Menace Santana",
        //     "Benjamin Epps",
        //     "Green Montana",
        //     "Jazzy Bazz", 
        //     "Doria",
        //     "Guy2Bezbar",
        //     "Gambino La MG",
        //     "Chilla",
        //     "ISK",
        //     "Laeti",
        //     "Todiefor",
        //     "Moji x Sboy",
        //     "Alpha Wann",
        //     "Zkr",
        //     "Sopico",
        //     "MadeInParis",
        //     "Népal",
        //     "PNL",
        //     "Hatik",
        //     "Jok'air"
        // ];

        setInterval(async () => {

            // const url = 'https://prod.radio-api.net/stations/now-playing?stationIds=skyrock';
            // let request = await axios.get(url).then(res => res.data[0].title);

            // if(!request.startsWith('SKYROCK')) request = request.slice(0, -9);

            // client.user.setActivity(request, { type: "LISTENING" });
            client.user.setActivity('music', { type: "LISTENING" });
 
        }, 10 * 1000);

        const rest = new REST({ version: "9"}).setToken(process.env.TOKEN);

        (async () => {

            try {

                if(process.env.ENV === 'production') {

                    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                        body: commands
                    });

                    console.log('[+] Registered commands');

                } else {

                    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
                        body: commands
                    });

                    const connection = joinVoiceChannel({
                        channelId: "957659615963799552",
                        guildId: process.env.GUILD_ID,
                        adapterCreator: client.guilds.cache.get(process.env.GUILD_ID).voiceAdapterCreator,
                    });
        
                    const resource = createAudioResource('http://icecast.skyrock.net/s/natio_mp3_128k', { inputType: StreamType.Arbitrary });
                    const player = createAudioPlayer();
        
                    player.play(resource);
                    connection.subscribe(player);

                    console.log('[+] Registered commands');
                    console.log('[+] Skyrock playing');
                    console.log('[+] Punchbot');

                }

            } catch (e) { console.error(e); }

        })();

    }
}