const Service = require('egg').Service;
// const ObjectId = require('mongoose').Types.ObjectId
// const moment = require('moment')

class CommentService extends Service {
  // 获取文章详情的评论
  async getPostComment() {
    const { ctx } = this
    return ctx.helper.returnBody(await this.pagingQuery())
  }

  // 分页
  async pagingQuery() {
    const { ctx } = this

    const data = await ctx.model.Comment.findOne({
      "postId": ctx.query.id
    }, { _id: 0 })
    // console.log(moment(ObjectId(data._id).getTimestamp()).format('YYYY-MM-DD HH:mm:ss'))
    const total = await ctx.model.Comment.estimatedDocumentCount()
    return {
      data,
      total
    }
  }
}

module.exports = CommentService