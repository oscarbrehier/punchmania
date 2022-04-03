const { MessageEmbed, CommandInteraction } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    async execute(interaction) {

        if(interaction.isCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);
            const permissions = command.permissions;
            const embed = new MessageEmbed()
                .setColor('#f39c12')

            if(permissions && permissions.length > 0) {

                if(!interaction.member.permissions.has(permissions)) {

                    embed.setTitle('Permission nécessaire manquante');
                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });

                }

            }

            if(!command) return;

            try { await command.execute(interaction); }
            catch(e) {

                console.error(e);
                // await interaction.reply({ content: 'Une erreur s\'est produite lors de l\'éxecution de la commande.', ephemeral: true });
                return await interaction.error({ 
                    content: "Une erreur s'est produite lors de l'éxecution de la commande",
                    ephemeral: true
                });

            }

        } 

    }
}