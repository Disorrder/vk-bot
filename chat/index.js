const _ = require('lodash');

class Bot {
    constructor(params = {}) {
        this.name = params.name || 'Какао Бот';
        this.test = params.test || new RegExp(`^(Bot|Бот|${this.name})([,]?\\s*)`, 'i');
        this.id = params.id || Bot.cache.length;
        this.network = params.network || null;
        this.clanTag = params.clanTag || null;
        this.admins = params.admins || [];

        this.commands = [];

        let ext = params.ext || [];
        ext = ext.concat(['basic']);
        ext.forEach(this.regExtension.bind(this));

        Bot.cache.push(this);
    }

    regExtension(extName) {
        let ext = require('./extensions/'+extName);
        // ext is Object with {commands[]} // TODO: think about replace or mixing
        // TODO: think about ext is a function(bot)
        // console.log('regExt', ext.commands);

        ext.commands.forEach(this.addCommand.bind(this));
    }

    addCommand(command) {
        return this.commands.push(command);
        // --- TODO: think about mixing ---
        let existCmd = this.commands.find((v) => v.cmd === command.cmd);
        if (!existCmd) return this.commands.push(command);

        if (command.text || command.test) {
            console.log('Bot warning: no support for mixing "text" and "test" fields');
        }

        if (command.reply) {
            if (_.isFunction(command.reply) || _.isFunction(existCmd.reply)) {
                console.log('Bot warning: no support for mixing functions');
            } else {
                existCmd.reply = _.flatten([existCmd.reply, command.reply]);
            }
        }
    }

    interpolate(text) {
        text = text.replace(/\${bot\.name}/gi, this.name);
        return text;
    }

    reply(msg) {
        var cmd;
        if (msg.text.indexOf('bot') === 0) {
            let [cmdName, ...params] = msg.bot_text.split(' ');
            cmd = this.commands.find((command) => command.cmd === cmdName);
            msg.bot_text_params = params;
        } else {
            cmd = this.commands.find((command) => command.test.test(msg.bot_text));
        }

        if (cmd) {
            msg.handled = true;
            if (_.isFunction(cmd.reply)) {
                let res = cmd.reply(msg, this);
                if (res.then) msg.bot_promise = res;
            } else if (_.isArray(cmd.reply)) {
                msg.bot_reply = cmd.reply[_.random(cmd.reply.length-1)];
            } else {
                msg.bot_reply = cmd.reply;
            }
        }

        if (msg.bot_promise) { // return message or promise here?
            return msg.bot_promise.then((msg) => {
                return this.replyHandler(msg);
            });
        }

        return this.replyHandler(msg);
    }

    replyHandler(msg) {
        if (!msg.bot_reply) msg.bot_reply = 'Игнор'; // debug

        if (msg.bot_reply) {
            if (msg.bot_reply.indexOf('${')+1) msg.bot_reply = this.interpolate(msg.bot_reply);

            msg.bot_reply = '[Bot] ' + msg.bot_reply; // debug
            this.vk.method('messages.send', {
                peer_id: msg.peer_id,
                message: msg.bot_reply
            });
        }

        return msg;
    }

    static getById(id) {
        return Bot.cache.find((v) => v.id === id);
    }
}

Bot.cache = [];

module.exports = Bot;
