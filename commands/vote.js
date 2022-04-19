const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const Track = require('../models/Track');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Votez pour votre oeuvre musicale préférée de la semaine")
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
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const type = interaction.options.getString('type');
        const song = interaction.options.getString('titre');
        const base = `https://itunes.apple.com/search?term=${song}&limit=1&entity=`;
        const responseEmbed = new MessageEmbed();

        const buttons = new MessageActionRow().addComponents(

            new MessageButton()
                .setCustomId('vote')
                .setLabel('Voter')
                .setStyle('SUCCESS'), 

            new MessageButton()
                .setCustomId('cancel')
                .setLabel('Annuler')
                .setStyle('DANGER')

            )

        let URL = (type == 'album') ? base + 'album' : base + 'song';

        const request = await interaction.request({ url: URL });
        const response = request.results[0];

        const trackType = (type == 'album') ? response.collectionName : response.trackName;

        if(request.resultCount != 1) {

            return interaction.error({
                content: "Je n'ai pas réussi à trouver cet album. Veuillez être plus précis dans votre recherche. Vous pouvez également fournir le lien [Itunes](https://music.apple.com/fr/browse) de l'oeuvre.",
                ephemeral: true
            });

        } else {

            responseEmbed
                .setColor("#2d7d46")
                .setAuthor({ name: `${response.artistName} - ${trackType}`, iconURL: response.artworkUrl100 })
                .setImage(response.artworkUrl100.replace(`100x100`, `1000x1000`))
                .setTimestamp()
    
            interaction.reply({ embeds: [responseEmbed], components: [buttons], ephemeral: true });

            const filter = (i) => {
                if(i.user.id === interaction.user.id) return true;
                return interaction.reply({ content: "Vous ne pouvez pas utiliser ce bouton" });
            } 

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {

                // interaction.deleteReply();

                const VotedEmbed = new MessageEmbed()
                        .setColor(interaction.randomColor())

                if(i.customId == 'vote') {

                    VotedEmbed
                        .setAuthor({ name: `${interaction.user.username} - A voté`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`**Chanson/Album:** ${trackType}\n**Artiste:** ${response.artistName}`)
                        .setImage(response.artworkUrl100.replace(`100x100`, `1000x1000`))
                        .setTimestamp()

                    i.reply({ embeds: [VotedEmbed], ephemeral: true })

                    const track = await Track.findOne({ trackId: response.trackId });

                    if(!track) {

                        console.log('missing track')

                        const addTrack = new Track({

                            trackType: type,
                            trackInfo: `${response.artistName} - ${trackType}`,
                            trackId: response.trackId,
                            trackIcon: response.artworkUrl100.replace(`100x100`, `1000x1000`),
                            timesVoted: 1,
                            week: 1

                        });
                    
                        addTrack.save()
                        .catch(err => console.error(err));

                    } else {

                        track.updateOne({

                            timesVoted: track.timesVoted + 1

                        })
                        .catch(err => console.error(err));

                    }

                } else {

                    VotedEmbed
                        .setAuthor({ name: `${interaction.user.username} - Vote annulé`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()

                    i.reply({ embeds: [VotedEmbed], ephemeral: true });

                }

            });

        } 

    }
}