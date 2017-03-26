const _ = require('lodash');
const moment = require('moment');
const Boss = require('./Boss');

const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;

var config = {
    bossRespawn: 6 * HOUR
};

var commands = [
    {
        text: '(когда|сколько до|время до|во сколько|через сколько)? ?(босса?).?$',
        async reply(msg) {
            var boss = await Boss.findOne().sort('-createdAt');
            var time = moment(boss.createdAt).add(config.bossRespawn, 'ms')
            var dur = moment.duration( time.diff(Date.now()) );
            dur = `${dur.hours()}ч ${dur.minutes()}мин`;
            console.log('BOSS', boss.createdAt, dur);
            msg.bot_reply = `Босс будет через ${dur} (В ${time.format('HH:mm')} по Мск)`;
            return msg;
        }
    },
    {
        text: 'босс (умер|рип|погиб)',
        async reply(msg) {
            var boss = await Boss.findOne().sort('-createdAt');
            if (boss) {
                boss.dead = Date.now();
            }

            boss = new Boss();
            boss.createdAt = Date.now();
            boss.save();
            msg.bot_reply = 'Записано ' + boss._id;
            return msg;
        }
    },
    {
        text: 'босс (будет )?через',
        async reply(msg) {
            var dur = msg.text.match(/\d+:\d+(:\d+)?/i);
            if (!dur) {
                msg.bot_reply = 'Неверный формат данных. Время должно быть "чч:мм" или "чч:мм:сс" (секунды можно не писать)';
                return msg;
            }
            let [h, m, s] = dur[0].split(':');
            dur = (+h) * HOUR + (+m) * MIN + (+s||0) * SEC;

            var boss = await Boss.findOne().sort('-createdAt');
            let time = moment().add(dur, 'ms');
            boss.createdAt = +time.clone().subtract(config.bossRespawn);
            boss.save();
            msg.bot_reply = `Записано. Босс будет в ${time.format('DD.MM.YYYY HH:mm')} по Мск. ${boss.createdAt}`;
            return msg;
        }
    },
    {
        text: '(Какой )?кд босса',
        reply(msg) {
            msg.bot_reply = config.bossRespawn + 'ms';
        }
    },
];

commands = commands.concat([
    {
        text: 'boss$',
        reply: commands[0].reply
    },
    {
        text: 'boss (rip|dead)$',
        reply: commands[1].reply
    },
]);

commands.forEach((v) => {
    if (!v.test) {
        let reg = v.text;
        reg = reg.replace(/\.$/i, '.*'); // '($|[,.!?])'
        v.test = new RegExp(`^${reg}`, 'i');
        console.log(v.test);
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
