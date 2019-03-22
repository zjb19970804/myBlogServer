const Controller = require('egg').Controller

class LabelController extends Controller {
  async getHotLabel() {
    const { ctx } = this
    ctx.body = await ctx.service.label.getHotLabel()
  }

  async createLabel() {
    const { ctx } = this
    const { text } = ctx.request.body
    ctx.body = await ctx.service.label.createLabel(text)
  }
}

module.exports = LabelController;