const User = require('./model');
const Router = require('koa-router');
var router = new Router();

// find by VK id. TODO: refactor
// router.get('/:id', (ctx) => {
//     return User.findOne({
//         'vk.id': +ctx.params.id
//     }).then((user) => {
//         ctx.body = user;
//     });
// });
// -- variant 2 --
router.get('/:id', async ctx => {
    var user = await User.findOne({
        'vk.id': +ctx.params.id
    });
    if (user) ctx.body = user;
});

router.put('/:id', async ctx => {
    var data = ctx.request.body
    var user = await User.findOne({
        'vk.id': +ctx.params.id
    });
    if (!user) return;

    if (data.access_token) user.access_token = data.access_token;
    if (data.message_token) user.message_token = data.message_token;

    user.save();
    ctx.body = user;
});

module.exports = router;
