require('./auth');
const cfg = require('./config.json');
const passport = require('koa-passport');
const Router = require('koa-router');
var router = new Router();

router.get('/', (ctx) => {
    console.log(ctx);
    ctx.body = "VK";
});

router.get('/token', (ctx) => {
    ctx.redirect(`https://oauth.vk.com/authorize?v=5.62&client_id=${cfg.client_id}&response_type=token&scope=messages`);
    ctx.body = "Getting token";
});

router.get('/auth', passport.authenticate('vkontakte'), async (ctx, next) => {
    console.log('auth', ctx);
});
router.get('/auth/callback', passport.authenticate('vkontakte', {
    successRedirect: '/bot',
    failureRedirect: '/vk?status=failed'
}));

module.exports = router;

// example
const vk = require('./api').vk;
router.get('/messages', async ctx => {
    var res = await vk.method('messages.get', {count: ctx.query.count});
    ctx.body = res;
});
router.get('/messages.send', async ctx => {
    var res = await vk.method('messages.send', ctx.query);
    ctx.body = res;
});

vk.$promise.then(() => {
    let q = vk.initLongPoll();
    q.then((hmm) => {
        vk.messages.start();
        // vk.messages.on('new', (res) => {
        //     console.log('lp.new:', res);
        // });

        vk.messages.on('message', (res) => {
            console.log('lp.message:', res);
        });
    })
})
