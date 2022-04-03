const voiceClient = require('../Client/VoiceClient');
const Channel = require('../models/Channel');

module.exports = {
    name: 'voiceStateUpdate',
    execute (oldState, newState) {
        
        // create private voice channel
        if(newState.channelId === "958257022774677564") {

            newState.guild.channels.create(`Vocal ${newState.member.user.username}`, {
                bitrate: 64000,
                type: 'GUILD_VOICE',
                topic: newState.member.id,
                userLimit: 4,
                reason: "+ Salon privé",
                parent: newState?.channel?.parent
            }).then(async (channel) => {

                newState.setChannel(channel);
                const salon = new Channel({ 
                    channelId: channel.id,
                    channelOwner: newState.member.user.id
                });

                await salon.save()
                    .catch((err) => console.log(err));


            });

        }

        // left channel 
        if(newState.channelId === null) {
        
            (async () => {

                const salon = await Channel.find({ channelId: oldState.channel.id });
                if(salon.length != 0) {

                    if(salon[0].channelOwner == oldState.member.user.id) {

                        const fetchChannel = oldState.guild.channels.cache.get(oldState.channel.id);
                        fetchChannel.delete();
                        await Channel.findOneAndDelete({ channelId: oldState.channel.id });
    
                    } 

                }

            })();

        }

    }
}   