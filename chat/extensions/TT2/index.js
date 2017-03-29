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
        cmd: 'tt2_boss',
        text: '(когда |сколько до |время до |во сколько |через сколько )?(босса?)$',
        async reply(msg) {
            var boss = await Boss.findOne().sort('-createdAt');
            var time = moment(boss.createdAt).add(config.bossRespawn, 'ms')
            var dur = moment.duration( time.diff(Date.now()) );
            dur = `${dur.hours()}ч ${dur.minutes()}мин`;
            msg.bot_reply = `Босс будет через ${dur} (В ${time.format('HH:mm')} по Мск)`;
            return msg;
        }
    },
    {
        cmd: 'tt2_boss_dead',
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
        cmd: 'tt2_boss_set',
        text: 'босс (будет )?через',
        async reply(msg) {
            var dur = msg.bot_text.match(/\d+:\d+(:\d+)?/i);
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
            msg.bot_reply = `Записано. Босс будет в ${time.format('DD.MM.YYYY HH:mm')} по Мск.`;
            return msg;
        }
    },
    {
        cmd: 'tt2_boss_get_cooldown',
        text: '(Какой )?кд босса',
        reply(msg) {
            msg.bot_reply = config.bossRespawn + 'ms';
        }
    },
];

commands.forEach((v) => {
    if (!v.test) {
        let reg = v.text;
        // reg = reg.replace(/\$$/i, '\\W*$');
        v.test = new RegExp(`^${reg}`, 'i');
    }
});

module.exports = {
    commands
};
