const rp = require('request-promise');
const LongPollVk = require('../components/LongPollVk');

class VK {
    constructor(options = {}) {
        this.client_id = options.client_id;
        this.client_secret = options.client_secret;
        this.v = options.v || VK.v;
        this.access_token = options.access_token;
    }

    static get v() { return 5.62 }

    method(name, query) {
        query = Object.assign({
            v: this.v,
            access_token: this.access_token,
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
        var res = await vk.method('messages.getLongPollServer');
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

const cfg = require('./config.json');
const User = require('../api/user/model');
var vk = new VK(cfg);
vk.$promise = User.findOne({active: true}).then((user) => {
    vk.access_token = user.access_token;
    console.log('ACCESS TOKEN WAS DEFINED', user.access_token);
});

module.exports.vk = vk;
