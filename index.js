require('babel-register');

const Koa = require('koa');
const app = new Koa();

// response
// app.use(ctx => {
//   ctx.body = 'Hello Koa';
// });

// async
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);

  ctx.body = 'Hello Koa';
});

app.listen(3000);
console.log('Server is ready on 3000 port!');
