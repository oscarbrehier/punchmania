const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const Track = require("../models/Track");

class Leaderboards {

    constructor() {}

    getLeaderboard(client) {

        // const tracks = await Track.find({ trackType: type });

        // const unsorted = [];
        // let leaders = [];
        // let votes = [];
        // let icon;

        // unsorted.push(tracks);
        // unsorted[0].sort((a, b) => b.timesVoted - a.timesVoted);

        // tracks.forEach(async (song, i = 1) => {

        //     if (i + 1 == 1) {
        //         icon = song.trackIcon;
        //     }

        //     leaders.push(`**${i + 1})** *${song.trackInfo}*`);
        //     votes.push(song.timesVoted);
        //     i++;

        // });

        // const description = [
        //     `${type == "single"
        //     ? "*TOP 10 Singles voté par vous*"
        //     : "*TOP 10 Projets voté par vous*"}`, 
        //     '*Week: 1*'
        // ]

        // const embed = new MessageEmbed()
        //     .setColor(interaction.randomColor())
        //     .setDescription(description.toString().replace(/,/g, '\n'))
        //     .addFields(
        //         {
        //         name: "Classement",
        //         value: leaders.slice(0, 10).toString().replace(/,/g, "\n"),
        //         inline: true,
        //         },
        //         {
        //         name: "Votes",
        //         value: votes.slice(0, 10).toString().replace(/,/g, "\n"),
        //         inline: true,
        //         }
        //     )
        //     .setTitle(type == "single" ? "Top 10 Singles" : "Top 10 Projets")
        //     .setImage(icon)
        //     .setTimestamp();

        // // interaction.reply({ embeds: [embed], ephemeral: true });
        // return embed;

        // this.client.cache.get('957296410171162694').send('hey')
        console.log('hye')

    }

}

module.exports = Leaderboards;