const Service = require('egg').Service;

class LabelService extends Service {
  // 获取热门标签
  async getHotLabel() {
    const { ctx } = this
    const data = await ctx.model.Label.find({})
    return ctx.helper.returnBody(data)
  }

  // 创建新标签
  async createLabel(text) {
    const { ctx } = this
    const isFind = await ctx.model.Label.findOne({
      text
    })
    if(isFind) {
      return ctx.helper.returnBody(isFind, 201, '标签已存在')
    }

    const data = await ctx.model.Label.create({
      text
    })
    if(data._id) {
      return ctx.helper.returnBody(data)
    }
  }
}

module.exports = LabelService