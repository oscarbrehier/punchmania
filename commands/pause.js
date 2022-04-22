const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Mettez la chanson en cours de lecture en pause'),
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

        queue.setPaused(true);

        interaction.reply({
            content: `***${queue.current.title} - ${queue.current.author}*** a été mis en pause **(${interaction.member.user.tag})**`
        });

    }
}