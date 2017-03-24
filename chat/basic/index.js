const _ = require('lodash');
var config = {};

var commands = [
    {
        text: '(привет|здарова|здравствуй).',
        reply: ['Привет', 'Здарова!', 'Здравствуй.', 'Доброго времени суток, уважаемый.']
    },
    {
        text: 'как тебя зовут.',
        reply: 'Меня зовут ${bot.name}' // TODO: add interpolation
    },
    {
        text: '.*(хуй|хуё|залуп|пизд|бля|еба|ёб|сука|пидор|пидар|педик).*',
        reply: 'Кто матерится, тот хуёво воспитан.'
    },
    {
        text: '.*(понима).*',
        reply: ['Да чё тут понимать-то? Всё же изи!', 'Прими сто грамм и тоже поймёшь!']
    },
];

commands.forEach((v) => {
    if (!v.test) {
        let reg = v.text.replace(/\.$/i, '(.*)') // '($|[,.!?])'
        v.test = new RegExp(`^${reg}\s*`, 'i');
    }
});

module.exports = function(msg) {
    var cmd = commands.find((cmd) => cmd.test.test(msg.bot_text));
    if (cmd) {
        if (_.isFunction(cmd.reply)) {
            cmd.reply(msg);
        } else if (_.isArray(cmd.reply)) {
            msg.bot_reply = cmd.reply[_.random(cmd.reply.length-1)];
        } else {
            msg.bot_reply = cmd.reply;
        }
    }
    return msg;
};
