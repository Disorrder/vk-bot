const rp = require('request-promise');

class VK {
    constructor(options = {}) {
        this.client_id = options.client_id;
        this.client_secret = options.client_secret;
        this.v = options.v || VK.v;
    }

    method(name, query) {
        query = Object.assign({
            v: this.v,
            access_token: this.access_token,
        }, query);

        return rp({
            uri: `https://api.vk.com/method/${name}`,
            qs: query,
        });
    }

    static get v() { return 5.62 }
}

module.exports = VK;
