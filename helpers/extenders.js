const { Interaction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const Embed = new MessageEmbed();
const colors = require('../assets/COLORS.json');

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

Interaction.prototype.success = function({ content, ephemeral}) {

    Embed
        .setColor('#2d7d46')
        .setDescription(content)

    return this.reply({ embeds: [Embed], ephemeral: ephemeral });

}

Interaction.prototype.isLink = function(str) {

    const pattern = new RegExp('^(https?:\\/\\/)?'+ 
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
    '(\\#[-a-z\\d_]*)?$','i');

    return !!pattern.test(str);

}

Interaction.prototype.randomColor = function() {

    return colors[Math.floor(Math.random() * colors.length)];

}

Interaction.prototype.getSong = async (type, song) => {

    const URL = `https://itunes.apple.com/search?term=${song}&limit=1&entity=${(type == 'album') ? 'album' : 'song'}`;
    const req = await axios.get(URL).then(res => res.data);

    return req;

}   
