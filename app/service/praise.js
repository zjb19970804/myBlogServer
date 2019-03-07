const Service = require('egg').Service;
const ObjectId = require('mongoose').Types.ObjectId

class PraiseService extends Service {
  // 获取点赞数
  async getPraise() {
    const { ctx } = this
    return ctx.helper.returnBody(await ctx.model.Praise.create({
      userId: '',
      commentId: '',
      actions: true
    }))
  }

  // 给评论点赞
  async thumbsUp() {
    const { ctx } = this
    const data = await ctx.helper.verifyToken(ctx)
    console.log(data)
    const { commentId, actions } = ctx.query
    // const res = await ctx.model.Praise.create({
    //   userId: '',
    //   commentId,
    //   actions
    // })
    return {}
  }
}

module.exports = PraiseService