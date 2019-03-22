const Service = require('egg').Service;
const ObjectId = require('mongoose').Types.ObjectId

class PraiseService extends Service {

  // 给评论点赞
  async thumbsUp() {
    const { ctx } = this
    // 检验token
    const data = await ctx.helper.verifyToken(ctx)
    if (!data.verify) return ctx.helper.loginFailure()

    const { commentId, actions } = ctx.request.body
    if (!commentId || !actions) return ctx.helper.returnBody(false, 201, '参数错误')
    const { userId } = data.message
    return await this.checkIsAction(userId, commentId, actions)
  }

  // 检查改条记录是否已操作过
  async checkIsAction(userId, commentId, actions) {
    const { ctx } = this
    // 是否有这条记录
    const isAction = await ctx.model.Praise.findOne({
      userId,
      commentId: ObjectId(commentId)
    })
    if (isAction === null) {
      // 没有就新建改记录
      const res = await ctx.model.Praise.create({
        userId,
        commentId: ObjectId(commentId),
        actions
      })
      if (!res._id) {
        console.error(res)
        return ctx.helper.returnBody(false, 201)
      }
      return ctx.helper.returnBody(true)
    }else {
      let res
      // 如果和之前的操作相同，则是取消以前的操作
      if (isAction.actions.toString() === actions) {
        res = await ctx.model.Praise.remove({
          _id: isAction._id
        })
      }
      // 否则就更改操作：点赞或踩
      res = await ctx.model.Praise.updateOne({
        userId,
        commentId: ObjectId(commentId)
      }, {"$set": {
        actions
      }
      })
      if (!res.ok) {
        console.error(res)
        return ctx.helper.returnBody(false, 201)
      }
      return ctx.helper.returnBody(true)
    }
  }
}

module.exports = PraiseService