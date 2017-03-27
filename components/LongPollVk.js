const LongPoll = require('./LongPoll');
const _ = require('lodash');

class LongPollVk extends LongPoll {
    handleResponse(res) {
        if (res.failed > 1) this.stop();
        if (res.failed) console.log('LP ERROR', res);
        if (res.failed) return this.emit('error', res);

        if (!_.isArray(res.updates)) return;
        this.emit('new', res); //?
        res.updates.forEach((v) => {
            if (!v[0]) return;
            if (v[0] == 4) {
                // let [code, message_id, flags, peer_id, ts, subject, text, attachments, random_id] = v;
                let msg = {
                    message_id: v[1],
                    flags: v[2],
                    peer_id: v[3],
                    ts: v[4],
                    subject: v[5],
                    text: v[6],
                    attachments: v[7],
                    random_id: v[8]
                };

                let peer = this.parsePeerId(msg.peer_id);
                Object.assign(msg, peer);

                this.emit('message', msg);
                if (peer.public_id) {
                    this.emit('message.public', msg);
                } else if (peer.chat_id) {
                    this.emit('message.chat', msg);
                } else {
                    this.emit('message.private', msg);
                }
            }
        })
    }

    parsePeerId(id) {
        if (id < 0) {
            return {public_id: -id};
        } else if (id > 2000000000) {
            return {chat_id: id - 2000000000};
        } else {
            return {user_id: id};
        }
    }

    decodePeerId(peer) { // idk why. May be useful.
        var id = peer[Object.keys(peer)[0]];
        if (peer.public_id) {
            return -id;
        } else if (peer.chat_id) {
            return id + 2000000000
        } else {
            return id;
        }
    }
}

module.exports = LongPollVk;
