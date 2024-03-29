exports.tryCatch = (successFn, errorFn) => {
  try {
    successFn()
  } catch (error) {
    arguments.length === 1 ? console.error(error) : errorFn()
  }
}
exports.returnBody = (data = null, code = 200, message = 'success') => {
  return {
    code,
    data,
    message
  }
}
exports.loginFailure = () => {
  return this.returnBody(null, -1, '登录失效')
}
// 获取 Token
exports.getAccessToken = ctx => {
  let bearerToken = ctx.request.header.authorization;
  return bearerToken && bearerToken.replace("Bearer ", "");
},
// 校验 Token
exports.verifyToken = async (ctx) => {
  let token = this.getAccessToken(ctx);
  let verifyResult = await ctx.service.user.verifyToken(token);
  return verifyResult;
}
