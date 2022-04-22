const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('filtre')
    .setDescription('Appliquez un filtre audio sur la chanson en cours de lecture')
    .addStringOption((option) => 
        option
        .setName('filtre')
        .setDescription('Le filtre audio choisi')
        .setRequired(true)
        .addChoices(
            { name: 'Bassboost Faible', value: 'bassboost_low' },
            { name: 'Bassboost', value: 'bassboost'},
            { name: 'Bassboost Fort', value: 'bassboost_high'},
            { name: '8D', value: '8D'},
            { name: 'Surround', value: 'surrounding'},
            { name: 'Mono', value: 'mono' },
            { name: 'Earrape', value: 'earrape' }
        )
    ),
    permissions: [],
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    async execute(interaction, client) {

        const queue = client.player.getQueue(interaction.guild.id);
        const filtre = interaction.options.getString('filtre');

        
        if(!queue || !queue.playing) {
            
            return interaction.reply({
                content: 'Il n\'y a pas de musique en cours de lecture',
                ephemeral: true 
            });
            
        }

        const filtres = [];     
        
        queue.getFiltersEnabled().map(x => filtres.push(x));
        queue.getFiltersDisabled().map(x => filtres.push(x));

        const filtrer = filtres.find((x) => x.toLowerCase() === filtre);
        const MAJ = {};

        MAJ[filtrer] = queue.getFiltersEnabled().includes(filtrer) ? false : true;

        await queue.setFilters(MAJ);

        interaction.reply({
            content: 'Done'
        });

    }
}