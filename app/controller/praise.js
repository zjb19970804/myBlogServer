const Controller = require('egg').Controller

class PraiseController extends Controller {
  // 给评论点赞
  async thumbsUp() {
    this.ctx.body = await this.ctx.service.praise.thumbsUp()
  }
}

module.exports = PraiseController;