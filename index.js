require('babel-register');
const cfg = require('./config.json');
global.hostUrl = `http://${cfg.api.hostname}:${cfg.api.port}`;

require('./model');

const Koa = require('koa');
var app = new Koa();

// --- middlewares ---
const serve = require('koa-static');
app.use(serve('./web'));
app.use(require('koa-cookie').default());
app.use(require('koa-bodyparser')());
app.use(require('koa-session')());

const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

// --- routing ---
const Router = require('koa-router');
var router = new Router();
const webRouter = require('./web');
const vkRouter = require('./vk');

router.use('/', webRouter.routes(), webRouter.allowedMethods());
router.use('/api/vk', vkRouter.routes(), vkRouter.allowedMethods());

app
  .use(router.routes())
  .use(router.allowedMethods())
;

// --- start server ---
app.listen(cfg.api.port, () => {
    console.log(`Server has run on ${global.hostUrl}`);
});
