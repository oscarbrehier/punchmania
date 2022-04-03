const { Interaction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const Embed = new MessageEmbed();

Interaction.prototype.request = async ({ url }) => {

    const req = await axios.get(url).then(res => res.data);
    return req;

}

Interaction.prototype.error = function({ content, ephemeral }, options = {}) {

    Embed
        .setColor('#d63031')
        .addField('Erreur', `*${content}*`)

    return this.reply({ embeds: [Embed], ephemeral: ephemeral })

}