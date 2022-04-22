const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('La file d\'attente des chansons'),
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

        if(!queue.tracks[0]) {

            return interaction.reply({
                content: 'Il n\'y a pas de musique qui suit celle-ci',
                ephemeral: true
            });

        }

        const tracks = queue.tracks.map((track, i) => `\`\`${i + 1}.\`\` ${track.title} (<@${track.requestedBy.id}>)`)
        const songs = queue.tracks.length;
        const max = songs > 5 ? `Et **${songs - 5}** autres chansons` : `Il y a **${songs}** dans la file d'attente`;

        const ResponseEmbed = new MessageEmbed()
        .setColor('#feca57')
        .setTimestamp()
        .setAuthor({ name: 'File d\'attente' })
        .setDescription(`**En cours**\n${queue.current.title}\n\n` + tracks.slice(0, 6).join(`\n`) + `\n\n${max}`)

        interaction.reply({ embeds: [ResponseEmbed] });

    }
}