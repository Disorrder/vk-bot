const rp = require('request-promise');
const LongPollVk = require('../components/LongPollVk');

class VK {
    constructor(options = {}) {
        this.client_id = options.client_id;
        this.client_secret = options.client_secret;
        this.v = options.v || VK.v;
        this.access_token = options.access_token;
        this.message_token = options.message_token;
    }

    static get v() { return 5.62 }

    method(name, query) {
        var token = this.access_token;
        var namespace = name.split('.')[0];
        if (namespace === 'messages') token = this.message_token;

        query = Object.assign({
            v: this.v,
            access_token: token,
        }, query);

        return rp({
            uri: `https://api.vk.com/method/${name}`,
            qs: query,
        }).then((res) => JSON.parse(res));
    }

    getUserById(id) {
        // TODO: cache users with timeout
        return this.method('users.get', {
            user_ids: id,
            fields: '',
            // name_case: 'nom'
        });
    }

    getMessageById(id) {
        return this.method('messages.getById', {
            message_ids: id,
            // preview_length: 0
        });
    }

    async initLongPoll() {
        var res = await this.method('messages.getLongPollServer');
        if (!res || !res.response) return console.log('[ERROR] messages.getLongPollServer responded', res);
        res = res.response;
        // this.longPollParams = res;
        // let url = `https://${res.server}?act=a_check&key=${res.key}&ts=${res.ts}&wait=25&mode=2&version=1`;
        let url = `https://${res.server}`;
        let query = {
            act: 'a_check',
            key: res.key,
            ts: res.ts,
            wait: 25,
            mode: 2,
            version: 1
        };
        this.messages = new LongPollVk(url, query);
        return this.messages;
    }
}

module.exports = VK;
