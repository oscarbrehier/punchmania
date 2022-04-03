const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, CommandInteraction } = require('discord.js');
const axios = require('axios').default;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription("Affiche les paroles d'une chanson")
    .addStringOption(option => 
        option
        .setName('titre')
        .setDescription("Titre de la chanson")    
        .setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const embed = new MessageEmbed();

        const song = interaction.options.getString('titre').replace(/ /g, '%20');
        
        // const trackId = await interaction.track(song);
        const trackId = await interaction.request({
            url: `https://www.shazam.com/services/search/v4/fr/GR/web/search?term=${song}&numResults=3&offset=0&types=artists,songs&limit=3`
        });

        const trackInfo = await interaction.request({
            url: `https://www.shazam.com/discovery/v5/fr/GR/web/-/track/${trackId.tracks.hits[0].track.key}?shazamapiversion=v3&video=v3`
        });

        if(!trackInfo.sections[1].text) {

            // embed.setColor('RANDOM')
            // embed.setDescription("Je n'ai pas pu trouvé les paroles de cette chanson");
            return await interaction.error({ content: "Je n'ai pas pu trouvé les paroles de cette chanson", ephemeral: true }); 
            return interaction.reply({ embeds: [Embed], ephemeral: true });

        }

        const lyrics = trackInfo.sections[1].text.join('--');

        const substring = (length) => {

            const regex = `.{1,${length}}`;
            const lines = lyrics
                .match(new RegExp(regex, "g"))
                .map((line) => line.replace(/--/g, "\n"));

            return lines;

        }

        const response = async () => {

            try {

                const embeds = substring(4096, lyrics).map((value, index) => {

                    const isFirst = index === 0;


                    return new MessageEmbed({
                        title: isFirst ? trackInfo.title + ' - ' + trackInfo.subtitle : null,
                        thumbnail: isFirst ? { url: trackInfo.images.coverart } : null,
                        color: '#9b59b6',
                        description: value,
                    });

                });

                return { embeds };

            } catch(e) { console.log(e); }

        }

        try {response().then((res) => { interaction.reply(res); });
        } catch(e) { console.log(e) }

    }
}