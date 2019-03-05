const Service = require('egg').Service;

class PostService extends Service {
  async getPost() {
    const posts = await this.pagingQuery(this.ctx.query.pageNum)
    return this.ctx.helper.returnBody(posts)
  }
  // 分页查询
  async pagingQuery(page = 1) {
    const { ctx } = this
    const data = await ctx.model.Post.find().limit(10).skip((page-1)*10)
    const total = await ctx.model.Post.estimatedDocumentCount()
    return {
      data,
      total
    }
  }
  // 获取文章详情的评论
  async getPostDetail() {
    const { ctx } = this
    const data = await ctx.model.Post.find()
    return ctx.helper.returnBody(data)
  }
}

module.exports = PostService