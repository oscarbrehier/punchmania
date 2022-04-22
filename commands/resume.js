const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reprendre')
    .setDescription('Reprendre la chanson'),
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

        queue.setPaused(false);

        interaction.reply({
            content: `***${queue.current.title} - ${queue.current.author}*** a été relancé **(${interaction.member.user.tag})**`
        });

    }
}