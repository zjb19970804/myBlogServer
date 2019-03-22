const Controller = require('egg').Controller

class UserController extends Controller {
  async accessToken() {
    const body = await this.service.user.accessToken()
    this.ctx.cookies.set('token', body.data, {
      httpOnly: false,
      signed: false,
      maxAge: 3600 * 1000
    })
    this.ctx.body = body
  }

  async getBloginfo() {
    this.ctx.body = await this.ctx.service.user.getBloginfo()
  }
}

module.exports = UserController;
