const Controller = require('egg').Controller

class CommentController extends Controller {
  async getPostComment() {
    this.ctx.body = await this.ctx.service.comment.getPostComment()
  }
}

module.exports = CommentController;