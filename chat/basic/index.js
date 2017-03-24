var config = {};

var commands = [
    {
        text: 'привет',
        reply(msg) {
            msg.bot_reply = 'Привет!';
            return msg;
        }
    }
];
