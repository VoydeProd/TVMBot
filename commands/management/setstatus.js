const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const lang = Utils.variables.lang;

module.exports = {
    name: 'setstatus',
    run: async (bot, message, args) => {
        message.channel.send(Embed({
            title: lang.ManagementModule.Commands.Setstatus.Embeds.Setup.Title,
            description: lang.ManagementModule.Commands.Setstatus.Embeds.Setup.Description
        })).then(async msg => {
            let emojis = ['🟢', '🔴', '🟠', '⚫']
            emojis.forEach(emoji => {
                msg.react(emoji).catch(err => { })
            });

            Utils.waitForReaction(emojis, message.author.id, msg).then(async reaction => {
                msg.delete();
                let type;

                if (reaction.emoji.name == '🟢') {
                    type = 'online'
                } else if (reaction.emoji.name == '🔴') {
                    type = 'dnd'
                } else if (reaction.emoji.name == '🟠') {
                    type = 'idle'
                } else if (reaction.emoji.name == '⚫') {
                    type = 'invisible'
                }
                
                if (bot.user.presence.status == type) return message.channel.send(Embed({
                    preset: "error",
                    description: lang.ManagementModule.Commands.Setstatus.AlreadySet
                }))

                await bot.user.setStatus(type)
                message.channel.send(Embed({ 
                    title: lang.ManagementModule.Commands.Setstatus.Embeds.Updated.Title,
                    description: lang.ManagementModule.Commands.Setstatus.Embeds.Updated.Description.replace(/{status}/g, type == 'dnd' ? lang.ManagementModule.Commands.Setstatus.Embeds.Updated.DND : type.charAt(0).toUpperCase() + type.substring(1))
                }))
            })
        });
    },
    description: "Set the bot's status",
    usage: 'setstatus',
    aliases: []
}
// 295149   8501   2331638    63250   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638