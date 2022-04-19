const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { Permissions, MessageEmbed, CommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('playing')
    .setDescription("Information sur la radio de Skyrock"),
    permissions: [
        Permissions.FLAGS.ADMINISTRATOR
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const embed = new MessageEmbed()
            .setColor('#ed1338')

        const url = 'https://prod.radio-api.net/stations/now-playing?stationIds=skyrock';
        let request = await axios.get(url).then(res => res.data[0].title);

        if(!request) {

            

        } else if(!request.startsWith('SKYROCK')) {

            request = request.slice(0, -9);
            const shazamURL = `https://www.shazam.com/services/search/v4/fr/GR/web/search?term=${request}&numResults=3&offset=0&types=artists,songs&limit=3`;
            const shazam = await axios.get(shazamURL).then(res => res.data.tracks.hits[0]);
            embed
                .setImage(shazam.track.share.image)
                .setURL(shazam.track.hub.options[0].actions[1].uri)

        }

        embed
            .setTitle(`**${request}**`)
        
        interaction.reply({ embeds: [embed], ephemeral: true }); 
        
    }
}