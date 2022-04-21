const DatabaseClient = require('./Client/DatabaseClient');
const { Client, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
require('./helper/extenders');

const client = new Client({ intents: 32767 });
module.exports = client;

console.clear();

new DatabaseClient().connect();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = [];

client.commands = new Collection();
client.cooldown = new Collection();

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);

}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {

    const event = require(`./events/${file}`);

    if(event.once) { client.once(event.name, (...args) => event.execute(...args, commands)); }
    else { client.on(event.name, (...args) => event.execute(...args, commands)); }

}

client.login(process.env.TOKEN);