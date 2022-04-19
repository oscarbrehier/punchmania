const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');
const { DiscordTogether } = require('discord-together');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pepite')
    .setDescription('Ajoutez un(e) chanson/album a la liste des pépites')
    .addStringOption(option => 
        option.setName("type")
        .setDescription("Type de l'oeuvre")
        .setRequired(true)
        .addChoice("Single", "single")
        .addChoice('Album', "album")
    )
    .addStringOption(option => 
        option.setName("titre") 
        .setDescription("Titre de l'oeuvre")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("autre")
        .setDescription("Informations supplémentaires telles que le nom de l'album si il s'agit d'un single")),
    permissions: [],
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    async execute(interaction) {

        interaction.client.discordTogether = new DiscordTogether(interaction.client);
        interaction.client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, 'sketchheads');

        const type = interaction.options.getString('type');
        const song = interaction.options.getString('titre');
        
        const data = await interaction.getSong(type, song);
        const res = data.results[0];
        
        const trackType = (type == 'album') ? res.collectionName : res.trackName;

        if(data.resultCount != 1) {

            return interaction.error({
                content: "Je n'ai pas réussi à trouver cet album. Veuillez être plus précis dans votre recherche. Vous pouvez également fournir le lien [Itunes](https://music.apple.com/fr/browse) de l'oeuvre.",
                ephemeral: true
            });

        } else {

            const TrackEmbed = new MessageEmbed()
                .setColor(interaction.randomColor())
                .setAuthor({ name: `${res.artistName} - ${trackType}`, iconURL: res.artworkUrl100 })
                .setTimestamp()
                .setImage(res.artworkUrl100.replace(`100x100`, `1000x1000`))
    
            interaction.reply({ embeds: [TrackEmbed], ephemeral: true });
        
        }

    }
}