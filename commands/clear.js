const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Supprimer un nombre donné de messages")
        .addIntegerOption((option) => 
            option
                .setName("nombre")
                .setDescription("Nombre de messages a supprimer")
                .setRequired(true)
        ),
    permissions: [Permissions.FLAGS.ADMINISTRATOR],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const amount = interaction.options.getInteger('nombre');
        const messages = await interaction.channel.messages.fetch({ limit: amount });
        const { size } = messages;

        messages.forEach((message) => message.delete());

        interaction.reply({ content: `${size} messages ont été supprimés`, ephemeral: true });

    }
}