const EventEmitter = require('events');
const rp = require('request-promise');

// not stable: not sure about each service uses 'ts' in query
class LongPoll extends EventEmitter {
    constructor(url, query) {
        super();
        this.url = url;
        this.query = query;
    }

    sendRequest() {
        return rp({uri: this.url, qs: this.query}).then((res) => {
            res = JSON.parse(res);
            this.handleResponse(res);
            this.query.ts = res.ts || Date.now();
            if (!this.active) return;
            return this.sendRequest();
        });
    }

    handleResponse(res) {
        this.emit('new', res);
    }

    start() {
        this.active = true;
        return this.sendRequest();
    }

    stop() {
        this.active = false;
    }
}

module.exports = LongPoll;
