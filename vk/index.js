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

// phantom methods
const phantom = require('phantom');
const User = require('../api/user/model');
router.get('/phantom/login', async (ctx) => {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on("onResourceRequested", function(requestData) {
        console.info('Requesting', requestData.url)
    });

    const status = await page.open('https://vk.com/');
    console.log(status);
    // console.log(page.phantom.getTitle());
    return;

    const content = await page.property('content');
    // console.log(content);
    ctx.body = content;

    await instance.exit();
});
router.get('/phantom/refreshMessageToken', async (ctx) => {
    // var user = await User.findOne()
});

module.exports = router;
