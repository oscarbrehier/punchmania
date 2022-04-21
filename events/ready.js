const {Routes} = require('discord-api-types/v9');
const {REST} = require('@discordjs/rest');
require('dotenv').config();

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {

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

                }

            } catch (e) { console.error(e); }

            console.log('[+] Punchbot');

        })();

    }
}