require('babel-register');
const cfg = require('./config.json');
const Koa = require('koa');
const Router = require('koa-router');

global.hostUrl = `http://${cfg.api.hostname}:${cfg.api.port}`
const vkRouter = require('./vk/routes');

var app = new Koa();
var router = new Router();

// --- middlewares ---
app.use(require('koa-cookie').default());
app.use(require('koa-bodyparser')());
app.use(require('koa-session2')());

const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

// --- routing ---
router.get('/', (ctx) => {
    ctx.body = 'Hey!'
});

router.use('/vk', vkRouter.routes(), vkRouter.allowedMethods());

app
  .use(router.routes())
  .use(router.allowedMethods())
;

// --- start server ---
app.listen(cfg.api.port, () => {
    console.log(`Server has run on ${global.hostUrl}`);
});
