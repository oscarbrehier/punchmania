const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Passer à la chanson suivante dans la file d\'attente'),
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

        queue.skip();

        interaction.reply({
            content: `***${queue.tracks[0].title} - ${queue.tracks[0].author}*** est maintenant en cours de lecture **(${interaction.member.user.tag})**`
        });

    }
}