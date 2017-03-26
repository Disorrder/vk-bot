class Bot {
    constructor(ext = []) {
        this.ext = ext.concat(['basic']);
        this.extensions = this.ext.map((v) => {
            let ext = require('./'+v);
            ext.bot = this;
            console.log(ext.bot);
            return ext;
        });

        this.name = 'Какао Бот';
        this.test = /^(Bot|Бот|О,? Великий)(,|\s+)\s*/i;
        Bot.cache.push(this);
    }

    // get test() { return this._test || this.test = new RegExp(`^${this.name}(,|\s+)\s*`, 'i') }

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

        if (msg.bot_action) { //?
            msg.bot_action();
        }

        return msg;
    }

    static getById(id) {
        return Bot.cache.find((v) => v.id === id);
    }
}

Bot.cache = [];

module.exports = Bot;
