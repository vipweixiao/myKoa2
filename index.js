let myKoa = require('./myKoa2/application');

let app = new myKoa();

app.use(function (ctx, next) {
  console.log('middleware1', ctx.req.url);
  ctx.aa ? ctx.aa++ : (ctx.aa = 1);
  next();
  console.log('middleware1-end');
  ctx.res.end('hello world!');
})

app.use(function (ctx, next) {
  console.log('middleware2');
  next();
  console.log('middleware2-end', ctx.aa);
})

app.listen(3333, function () {
  console.log('create server success!,listening 3333 prot!');
});
