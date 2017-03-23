require('./auth');
const cfg = require('./config.json');
const passport = require('koa-passport');
const Router = require('koa-router');
var router = new Router();

const VK = require('./api');
var vk = new VK(cfg);
vk.access_token = '4c9b5cf60a1151e555ae8a23362ffbec92e4511cb2cfa93160e6f99e842d1a159f78f78cdb1d02c61cbb0';

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

router.get('/messages', async ctx => {
    var res = await vk.method('messages.get', {count: ctx.query.count});
    ctx.body = res;
});

module.exports = router;
