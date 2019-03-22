const Controller = require('egg').Controller

class PostController extends Controller {
  // 获取文章列表
  async getPost() {
    this.ctx.body = await this.ctx.service.post.getPost()
  }
  // 获取热门文章
  async getHotPost() {
    this.ctx.body = await this.ctx.service.post.getHotPost()
  }
  // 获取推荐文章
  async getRecommendPost() {
    this.ctx.body = await this.ctx.service.post.getRecommendPost()
  }
  // 根据标签获取文章
  async getPostByLabel() {
    const { id } = this.ctx.query
    this.ctx.body = await this.ctx.service.post.getPostByLabel(id)
  }
  // 获取文章详情
  async getDetail() {
    const { id } = this.ctx.query
    this.ctx.body = await this.ctx.service.post.getDetail(id)
  }

  // 发布文章
  async publishArticle() {
    this.ctx.body = await this.ctx.service.post.publishArticle()
  }
  async updateArticle() {
    this.ctx.body = await this.ctx.service.post.updateArticle()
  }
}

module.exports = PostController;