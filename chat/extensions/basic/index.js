const _ = require('lodash');
var config = {};

var commands = [
    {
        text: '(привет|здарова|здравствуй)',
        reply: ['Привет', 'Здарова!', 'Здравствуй.', 'Доброго времени суток, уважаемый.']
    },
    {
        text: 'как тебя зовут',
        reply(msg) { msg.bot_reply = `Меня зовут ${extension.bot.name}` }
    },
    {
        text: 'вернулся',
        reply: 'Что, скучали? ☺'
    },
    {
        text: '.*понима.*',
        reply: [
            'Да чё тут понимать-то? Всё же изи!',
            'Ну, если подумать...',
            'Если б понимал, мы бы с тобой тут не разговаривали.'
        ]
    },
    {
        text: '.*(хуй|хуё|залуп|пизд|бля|еб[аиё]|ёб|сука|пид[ао]р|педик|муда)',
        reply: ['Кто матерится, тот хуёво воспитан.', 'Ох уж эти кожаные ублюдки...']
    },

    // -- default --
    {
        text: '',
        reply: ['Не понимаю :(', 'Ой, всё!', 'Даже не знаю, что на это ответить...']
    }
];

commands.forEach((v) => {
    if (!v.test) {
        let reg = v.text;
        // reg = reg.replace(/\.$/i, '.*'); // '($|[,.!?])'
        v.test = new RegExp(`^${reg}`, 'i');
    }
});

function extension(msg) {
    var cmd = commands.find((cmd) => cmd.test.test(msg.bot_text));
    if (cmd) {
        msg.handled = true;
        if (_.isFunction(cmd.reply)) {
            let res = cmd.reply(msg);
            if (res.then) msg.bot_promise = res;
        } else if (_.isArray(cmd.reply)) {
            msg.bot_reply = cmd.reply[_.random(cmd.reply.length-1)];
        } else {
            msg.bot_reply = cmd.reply;
        }
    }
    return msg;
};

module.exports = extension;
