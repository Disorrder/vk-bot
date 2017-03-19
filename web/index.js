const Router = require('koa-router');
var router = new Router();

const Pug = require('koa-pug');
var pug = new Pug({
    viewPath: './web',
});

router.get('index.html', (ctx) => ctx.redirect('/'))
router.get('/', (ctx) => {
    ctx.body = pug.render('index');
});

router.get('bot', (ctx) => {
    ctx.body = pug.render('bot/template');
});

module.exports = router;
