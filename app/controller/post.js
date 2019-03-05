const Controller = require('egg').Controller

class PostController extends Controller {
  async getPost() {
    this.ctx.body = await this.ctx.service.post.getPost()
  }
}

module.exports = PostController;