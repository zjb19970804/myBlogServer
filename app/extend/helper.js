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
// 获取 Token
exports.getAccessToken = ctx => {
  let bearerToken = ctx.request.header.authorization;
  return bearerToken && bearerToken.replace("Bearer ", "");
},
// 校验 Token
exports.verifyToken = async (ctx, userId) => {
  let token = this.getAccessToken(ctx);
  let verifyResult = await ctx.service.user.verifyToken(token);
  if (!verifyResult.verify) {
    ctx.helper.error(ctx, 401, verifyResult.message);
    return false;
  }
  if (userId != verifyResult.message.id) {
    ctx.helper.error(ctx, 401, "用户 ID 与 Token 不一致");
    return false;
  }
  return true;
}
