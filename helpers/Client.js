const { Client } = require('discord.js');
const Track = require("../models/Track");
const {MessageEmbed} = require('discord.js');
const colors = require('../assets/COLORS.json');
const Week = require('../models/Week');

Client.prototype.randomColor = function() {

    return colors[Math.floor(Math.random() * colors.length)];

}

Client.prototype.leaderboards = async (client, type, channel) =>  {

    const week = await Week.find();
    const tracks = await Track.find({ trackType: type, week: week[0].week });

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
        `*Week: ${week[0].week}*`
    ];

    const embed = new MessageEmbed()
        .setColor(client.randomColor())
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

    client.channels.cache.get(channel).send({ embeds: [embed] });        

}