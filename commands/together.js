const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("together")
        .setDescription("Jouez à un jeu ou regardez des vidéos avec vos amis directement dans un salon vocal")
        .addStringOption(option => 
            option.setName("activité")
                .setDescription("L'activité que vous souhaitez lancer")
                .setRequired(true)
                .addChoices(
                    { name: 'Youtube', value: 'youtube' },
                    { name: 'Fishing', value: 'fishing' },
                    { name: 'Trahison', value: 'betrayal' },
                    { name: 'Poker', value: 'poker' }, //nitro
                    { name: 'Échecs', value: 'chess' }, //nitro
                    { name: 'Dames', value: 'checkers' }, //nitro
                    { name: 'Croquis', value: 'sketchheads' },
                    { name: 'Ocho', value: 'ocho' }, //nitro
                    { name: 'Puttparty', value: 'puttparty' }, //no access
                    { name: 'Wordsnack', value: 'wordsnack' }, //nitro
                    { name: 'Lettertile', value: 'lettertile' } //nitro
        )
        
    ).addMentionableOption(option => 
        option.setName('utilisateur')
        .setDescription('Mentionnez un utilisateur si vous souhaitez l\'invité à l\'activité')
    ),
    cooldown: 5000 * 5,
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    async execute(interaction) {                    
        
        const activities = {
            'youtube': { name: 'Youtube', nitro: false },
            'fishing': { name: 'La pêche', nitro: false },
            'betrayal': { name: 'Trahison', nitro: false },
            'poker': { name: 'Poker', nitro: true },
            'chess': { name: 'Échecs', nitro: true },
            'checkers': { name: 'Dames', nitro: true },
            'sketchheads': { name: 'Croquis', nitro: true },
            'ocho': { name: 'Ocho', nitro: true },
            'puttparty': { name: 'Puttparty', nitro: true },
            'wordsnack': { name: 'Wordsnack', nitro: true },
            'lettertile': { name: 'Lettertile', nitro: true },
        };

        const option = interaction.options.getString('activité');

        interaction.client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, option).then(async invite => {
            
            const row = new MessageActionRow().addComponents(

                new MessageButton()
                    .setLabel(`Rejoindre l'activité`)
                    .setStyle('LINK')
                    .setURL(invite.code)

            );                        
            
            const InviteEmbed = new MessageEmbed()
                .setColor('#feca57')
                
            if(activities[option].nitro == false) {

                InviteEmbed.setAuthor({ name: `${interaction.member.user.username} à lancer une activité`, iconURL: interaction.member.user.avatarURL() })
                .setDescription(`Activité: ${activities[option].name}`)

                interaction.reply({ 
                    embeds: [InviteEmbed], 
                    components: [row] 
                });

            } else {

                InviteEmbed.setDescription(`Ce serveur à besoin d'être boosté afin de pouvoir lancer cette activité. 
                Aidez-nous à booster ce serveur afin de pouvoir accéder à ces fonctionnalités supplémentaires.`)

                interaction.reply({ 
                    embeds: [InviteEmbed]
                });

            }                           

        });                     

    }
}