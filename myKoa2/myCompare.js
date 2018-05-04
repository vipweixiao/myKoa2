module.exports = compare;

function compare(aMiddleware) {
  
  if (!Array.isArray(aMiddleware)) {
    throw new TypeError('aMiddleware must be an array!');
  }
  for(const fn of aMiddleware){
    if (typeof fn !== 'function') {
      throw new TypeError('middleware must be comoposed of function')
    }
  }

  return function (ctx) {
    let index = -1;
    return dispath(0);

    function dispath(i) {
      if (i <= index) {
        throw new Error('next() called xxx');
      }
      if (i === aMiddleware.length) {
        return Promise.resolve();
      }
      index = i;
      let fn = aMiddleware[i];
      try {
        // 第二个参数就是中间件的next方法，是koa洋葱模型的关键，其实就是递归调用
        return Promise.resolve(fn(ctx, ()=>{
          dispath(i+1);
        }))
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
}