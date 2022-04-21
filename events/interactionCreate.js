const ms = require('ms');
const { DiscordTogether } = require('discord-together');
const { MessageEmbed, CommandInteraction } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    async execute(interaction) {

        interaction.client.discordTogether = new DiscordTogether(interaction.client);

        if(interaction.isCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);
            const permissions = command.permissions;

            const embed = new MessageEmbed()
                .setColor("RANDOM")

            if(permissions && permissions.length > 0) {

                if(!interaction.member.permissions.has(permissions)) {

                    embed.setAuthor({ name: 'Permission nécessaire manquante', iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });

                }

            }

            if(!command) return;

            try {

                if(command.cooldown) {

                    const Timeout = interaction.client.cooldown;

                    if(Timeout.has(`${command.data.name}${interaction.member.id}`)) {
                        
                        const TimeoutEmbed = new MessageEmbed()
                            .setColor('#feca57')
                            .setAuthor({ name: 'Cooldown', iconURL: interaction.member.user.avatarURL() })
                            .setDescription(`Oula! Pas trop vite, vous devez attendre **${ms(Timeout.get(`${command.data.name}${interaction.member.id}`) - Date.now())}** avant de pouvoir utiliser à nouveau cette commande.`)

                        return interaction.reply({ 
                            embeds: [TimeoutEmbed],
                            ephemeral: true
                        });
                    
                    }

                    await command.execute(interaction);
                    Timeout.set(`${command.data.name}${interaction.member.id}`, Date.now() + command.cooldown);

                    setTimeout(() => {
                        Timeout.delete(`${command.data.name}${interaction.member.id}`)
                    }, command.cooldown);

                } else {

                    await command.execute(interaction);
                
                }
            
            } catch(e) {

                console.error(e);
    
                return await interaction.error({ 
                    content: "Une erreur s'est produite lors de l'éxecution de la commande",
                    ephemeral: true
                });

            }

        } 

    }
}