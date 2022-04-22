const { QueryType } = require('discord-player');
const { joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Écoute de la musique depuis un salon vocal")
        .addStringOption(option =>
            option.setName('requête')
            .setDescription('Titre ou lien de la chanson')
            .setRequired(true)
            // .addChoices({ name: 'Rick Roll', value: 'rick_roll', required: false })
        )   
    ,
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    async execute(interaction, client) {                    
        
        const query = interaction.options.getString('requête');

        const res = await client.player.search(query, { 
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if(!res || !res.tracks.length) {

            return interaction.error({ 
                content: "Aucun résultat lié à votre demande de recherche n'a été trouvé",
                ephemeral: true
            });

        }

        const queue = await client.player.createQueue(interaction.guild, { metadata: interaction.channel });

        if(!interaction.member.voice.channel) {

            return interaction.reply({
                content: `Vous devez être dans un salon vocal afin de pouvoir utiliser cette commande`,
                ephemeral: true
            });

        }

        try { if(!queue.connection) await queue.connect(interaction.member.voice.channel); } 
        catch(e) { 

            await client.player.deleteQueue(interaction.guild.id);
            return interaction.error({
                content: "Je n'ai pas pu rejoindre le salon vocal",
                ephemeral: true
            });

        }

        const ResponseEmbed = new MessageEmbed()
            .setColor('#feca57')

        if(res.playlist) {

            ResponseEmbed
            .setAuthor({ name: queue.playing ? `${res.playlist.title} • ajouté a la file d\'attente` : `${res.playlist.title} • en cours de lecture`, iconURL: interaction.member.user.avatarURL() })
            .setDescription(`Créateur: ${res.playlist.author.name}\nPistes: ${res.playlist.tracks.length}`)
            .setImage(res.playlist.thumbnail)
            .setTimestamp()

            interaction.reply({ embeds: [ResponseEmbed] });

        } else {

            ResponseEmbed
            .setAuthor({ name: queue.playing ? `${res.tracks[0].title} • ajouté a la file d\'attente` : `${res.tracks[0].title} • en cours de lecture`, iconURL: interaction.member.user.avatarURL() })
            .setDescription(`Artiste: ${res.tracks[0].author}\nDurée: ${res.tracks[0].duration}`)
            .setImage(res.tracks[0].thumbnail)
            .setTimestamp()

            interaction.reply({ embeds: [ResponseEmbed] });
            client.songs.set(interaction.member.user.id, {
                on: new Date(),
                song: res.tracks[0].title,
                artist: res.tracks[0].author
            });

        }

        joinVoiceChannel({ 
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: true
        });

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();

    }
}