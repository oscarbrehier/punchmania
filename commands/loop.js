const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Jouez en boucle la chanson en cours de lecture'),
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

        queue.setRepeatMode(queue.repeatMode == 0 ? 1 : 0);

        interaction.reply({ 
            content: `Loop mode ***${queue.repeatMode === 1 ? 'ACTIVÉ' : 'DÉSACTIVÉ'}***`
        });

    }
}