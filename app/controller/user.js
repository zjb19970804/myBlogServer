const Controller = require('egg').Controller

class UserController extends Controller {
  async accessToken() {
    const body = await this.service.user.accessToken()
    this.ctx.cookies.set('token', body.data, {
      httpOnly: false,
      signed: false
    })
    this.ctx.body = body
  }
}

module.exports = UserController;
