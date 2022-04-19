const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const Track = require("../models/Track");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Classements des oeuvres de la semaine")
        .addStringOption((option) =>
        option
            .setName("type")
            .setDescription("Type de l'oeuvre")
            .setRequired(true)
            .addChoice("Single", "single")
            .addChoice("Album", "album")
        ),
    permissions: [Permissions.FLAGS.ADMINISTRATOR],
    /**
     *
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {

        const type = interaction.options.getString("type");

        console.log(type);
        const tracks = await Track.find({ trackType: type });

        const unsorted = [];
        let leaders = [];
        let votes = [];
        let icon;

        unsorted.push(tracks);
        unsorted[0].sort((a, b) => b.timesVoted - a.timesVoted);

        tracks.forEach(async (song, i = 1) => {

            if (i + 1 == 1) {
                icon = song.trackIcon;
            }

            leaders.push(`**${i + 1})** *${song.trackInfo}*`);
            votes.push(song.timesVoted);
            i++;

        });

        const description = [
            `${type == "single"
            ? "*TOP 10 Singles voté par vous*"
            : "*TOP 10 Projets voté par vous*"}`, 
            '*Week: 1*'
        ]

        const embed = new MessageEmbed()
            .setColor(interaction.randomColor())
            .setDescription(description.toString().replace(/,/g, '\n'))
            .addFields(
                {
                name: "Classement",
                value: leaders.slice(0, 10).toString().replace(/,/g, "\n"),
                inline: true,
                },
                {
                name: "Votes",
                value: votes.slice(0, 10).toString().replace(/,/g, "\n"),
                inline: true,
                }
            )
            .setTitle(type == "single" ? "Top 10 Singles" : "Top 10 Projets")
            .setImage(icon)
            .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true });
        
    }
};
