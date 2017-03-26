require('babel-register');
const cfg = require('./config.json');
global.hostUrl = `http://${cfg.api.hostname}:${cfg.api.port}`;
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const Koa = require('koa');
var app = new Koa();

// --- middlewares ---
const serve = require('koa-static');
app.use(serve('./web'));
app.use(require('koa-cookie').default());
app.use(require('koa-bodyparser')());
app.use(require('koa-session')(app));
app.keys = ['appKey']; // some secret shit for koa-session

const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

// --- routing ---
const Router = require('koa-router');
var router = new Router();
const webRouter = require('./web');
const apiRouter = require('./api');
const vkRouter = require('./vk');

router.use('', webRouter.routes(), webRouter.allowedMethods());
router.use('', apiRouter.routes(), apiRouter.allowedMethods());
router.use('/vk', vkRouter.routes(), vkRouter.allowedMethods());

app
  .use(router.routes())
  .use(router.allowedMethods())
;

// --- start server ---
app.listen(cfg.api.port, () => {
    console.log(`Server has run on ${global.hostUrl}`);
});

// --- start up ---
const User = require('./api/user/model');
const VK = require('./vk/api');
const Bot = require('./chat');

async function run() {
    // -- init bot per user --
    var users = await User.find({active: true, vk: {$exists: true}});
    const vkCfg = require('./vk/config');

    users.forEach(async (user) => {
        var vk = new VK(vkCfg);
        vk.access_token = user.access_token;
        vk.message_token = user.message_token;

        var defaultBot = new Bot(['TT2']);
        defaultBot.vk = vk;

        await vk.initLongPoll();
        vk.messages.start();
        vk.messages.on('message', (msg) => {
            console.log('lp.message', msg.text);
            var bot = defaultBot;
            var tested = bot.test.test(msg.text);
            if (tested) {
                msg.bot_text = msg.text.replace(bot.test, '');
                bot.reply(msg);
            }
        });
    });
}
run();
