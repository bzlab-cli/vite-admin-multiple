/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2024/01/26 10:20:19
 */

import Koa, { Context } from "koa";
import koaBody from "koa-body";
import koaRouter from "koa-router";
import addRouter from "./router";
import logger from "koa-logger";
import log4js from "log4js";
import { ResponseHandler } from './middleware/response'
import chalk from "chalk";
import cors from "koa2-cors";

const app = new Koa();
app.use(cors());
const router = new koaRouter();

const port = 3301;
const log4 = log4js.getLogger();
log4.level = "debug";

//日志打印
app.use(logger(info => {
  log4.debug(info);
}));

app.use(koaBody());

app.use(async (ctx, next) => {
  await next()
  log4.debug(chalk.green('请求参数：') + ctx.request.url, JSON.stringify(ctx.request.body), JSON.stringify(ctx.body));
})

app.use(ResponseHandler());
//加载路由
addRouter(router);
//启动路由
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx: Context) => {
  log4.error(`404 ${ctx.message} : ${ctx.href}`);
  ctx.status = 404;
  ctx.body = "404! api not found !";
});

app.on("error", (err, ctx: Context) => {
  log4.error(err); //log all errors
  ctx.status = 500;
  if (ctx.app.env !== "development") {
    ctx.res.end(err.stack);
  }
});

app.listen(port, () => {
  log4.debug("mock server running at: http://localhost:%d", port);
});
