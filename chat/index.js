class Bot {
    constructor(ext = []) {
        this.ext = ext.concat(['basic']);
        this.extensions = this.ext.map((v) => {
            let ext = require('./extensions/'+v);
            ext.bot = this;
            return ext;
        });

        this.name = 'Какао Бот';
        this.test = /^(Bot|Бот|О,? Великий)(,|\s+)\s*/i;
        this.id = Bot.cache.length;
        Bot.cache.push(this);
    }

    reply(msg) {
        this.extensions.find((ext) => {
            ext(msg);
            return msg.handled;
        });

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
