const Controller = require('egg').Controller

class PraiseController extends Controller {
  // 获取评论的点赞
  async getPraise() {
    this.ctx.body = await this.ctx.service.praise.getPraise()
  }

  // 给评论点赞
  async thumbsUp() {

  }
}

module.exports = PraiseController;