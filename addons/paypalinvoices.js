const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../modules/utils');

function genURL(email, amount, item) {
    return `https://www.paypal.com/cgi-bin/webscr?&cmd=_xclick&business=${email}&currency_code=USD&amount=${amount}&item_name=${encodeURIComponent(item.trim())}&no_shipping=1`;
}
module.exports = async (bot) => {
    const CustomConfig = require('../modules/CustomConfig.js');
    const config = new CustomConfig('./addon_configs/paypalinvoices.yml', {
        "Command": "invoice",
        "Permission": "Admin",
        "Enable_Pay_User": true,
        "Users": {
            "DISCORD_ID": "PAYPAL_EMAIL"
        },
        "Require_Item_Name": true
    })
    const usage = `${config.Command} <${config.Enable_Pay_User ? '@user|email' : 'email'}> <price> <item>`;
    require('../modules/handlers/CommandHandler').set({
        name: config.Command,
        run: async (bot, message, args) => {
            if (!Utils.hasPermission(message.member, config.Permission)) return message.channel.send(Utils.Embed({ preset: "nopermission" }));

            if (args.length < (config.Require_Item_Name ? 3 : 2)) return message.channel.send(Utils.Embed({ preset: "invalidargs", usage: usage }));

            const amount = parseFloat(args[1]);
            if (!amount) return message.channel.send(Utils.Embed({ preset: "invalidargs", usage: usage }));

            let email = args[0];

            if (config.Enable_Pay_User) {
                const user = Utils.ResolveUser(message);
                if (user) {
                    const targetEmail = config.Users[user.id];
                    if (targetEmail) email = targetEmail;
                }
            }

            const item = args.slice(2).join(" ") || "Not Specified";

            const url = genURL(email, amount, item);

            message.channel.send(Utils.Embed({
                title: "Invoice Created",
                fields: [
                    {
                        name: "Receiver",
                        value: email,
                        inline: true
                    },
                    {
                        name: "Amount",
                        value: amount,
                        inline: true
                    },
                    {
                        name: "Item",
                        value: item,
                        inline: true
                    },
                    {
                        name: "Invoice Link",
                        value: `[Click here](${url})`
                    }
                ]
            }))
        },
        description: 'Create a paypal invoice',
        usage: usage,
        aliases: [

        ],
        type: 'addon'
    })
}