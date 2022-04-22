const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Arrêtez toute musique en cours dans le salon vocal'),
    permissions: [],
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    async execute(interaction, client) {

        const queue = client.player.getQueue(interaction.guild.id);

        if(!queue || !queue.playing) {

            return interaction.reply({
                content: 'Il n\'y a pas de musique en cours de lecture',
                ephemeral: true 
            });

        }

        queue.destroy();

        interaction.reply({
            content: '***Punchmusic*** à quitter le salon'
        });

    }
}