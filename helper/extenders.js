const { Interaction, MessageEmbed } = require('discord.js');
const Embed = new MessageEmbed();

Interaction.prototype.error = function({ content, ephemeral }, options = {}) {

    Embed
        .setColor('#d63031')
        .addField('Erreur', `*${content}*`)

    return this.reply({ embeds: [Embed], ephemeral: ephemeral })

}

