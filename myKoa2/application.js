let http = require('http');
let Emitter = require('events');
let compare = require('./myCompare.js');

class Koa extends Emitter {
  constructor(){
    super();
    this.ctx = {name: 'ctx'};
    this.req = {name: 'req'};
    this.res = {name: 'res'};
    // use中所有中间件存放的数组
    this.aMiddleware = [];
  }

  use(middleware){
    if (typeof middleware !== 'function') {
      throw new TypeError('middleware must be a function');
    }
    // 把中间件放入数组中
    this.aMiddleware.push(middleware);
  }

  callback(){
    let fn = compare(this.aMiddleware);
    // 把emiter('error')触发的事件，绑定到this.onerror上
    if (this.listenerCount('error') === 0) {
      this.on('error', this.onerror);
    }
    return (req, res) => {
      let ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    }
  }

  createContext(req, res){
    this.ctx.req = req;
    this.ctx.res = res;

    return this.ctx;
  }

  handleRequest(ctx, fnMiddleware){
    let handleResponse = () => {console.log('handleResponse')};
    let fnError = (err) => { this.onerror(err)};
    // 返回各中间件的执行结果
    return fnMiddleware(ctx).then(this.handleResponse).catch(fnError);
  }

  listen(...args){
    let server = http.createServer(this.callback());
    server.listen(...args);
  }

  onerror(err) {
    console.log('this is koa onerror', error);
  }
}

module.exports = Koa;