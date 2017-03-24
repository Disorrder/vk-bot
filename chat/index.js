class Bot {
    constructor(ext = []) {
        this.ext = ['basic'].concat(ext);
        this.extensions = this.ext.map((v) => require('./'+v));

        this.name = 'Бот';
        this.test = /^(Bot|Бот)(,|\s+)\s*/i;
        Bot.cache.push(this);
    }

    // get test() { return this._test || this.test = new RegExp(`^${this.name}(,|\s+)\s*`, 'i') }

    reply(msg) {
        this.extensions.find((ext) => {
            ext(msg);
            return !!msg.bot_reply;
        });
        // console.log('[Bot]', msg.bot_reply);
        if (!msg.bot_reply) msg.bot_reply = 'Не понимаю :('
        msg.bot_reply = '[Bot] ' + msg.bot_reply; // debug
        return msg;
    }

    static getById(id) {
        return Bot.cache.find((v) => v.id === id);
    }
}

Bot.cache = [];

module.exports = Bot;
