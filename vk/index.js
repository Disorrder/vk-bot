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
