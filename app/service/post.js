const Service = require('egg').Service;
const ObjectId = require('mongoose').Types.ObjectId
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const fs = require('fs')
const moment = require('moment')

class PostService extends Service {
  async getPost() {
    const posts = await this.pagingQuery(this.ctx.query.pageNum, this.ctx.query.id)
    return this.ctx.helper.returnBody(posts)
  }
  // 分页查询
  async pagingQuery(page = 1, labelId) {
    const { ctx } = this
    const pageSize = 5
    const obj = labelId ? {
      labelId: ObjectId(labelId)
    } : {}
    const data = await ctx.model.Post.find(obj).limit(pageSize).skip((page - 1) * pageSize)
    const total = await ctx.model.Post.find(obj).countDocuments()
    return {
      data,
      total
    }
  }

  // 获取热门文章
  async getHotPost() {
    const { ctx } = this
    const data = await ctx.model.Post.find({}, {
      title: 1,
      poster: 1
    }, {sort: {'watchTimes': -1}}).limit(4)
    return ctx.helper.returnBody(data)
  }
  // 推荐阅读(随机)
  async getRecommendPost() {
    const { ctx } = this
    const data = await ctx.model.Post.aggregate([
      {
        $sample: {
          size: 6
        }
      },
      {
        $project: {
          content: 0,
          reprint: 0
        }
      }
    ])
    return ctx.helper.returnBody(data)
  }

  // 根据标签获取文章
  async getPostByLabel(id) {
    const { ctx } = this
    const data = await ctx.model.Post.find({
      labelId: ObjectId(id)
    })
    return ctx.helper.returnBody(data)
  }

  // 获取文章详情
  async getDetail(id) {
    const data = await this.ctx.model.Post.findOne({
      _id: id
    })
    await this.ctx.model.Post.updateOne({
      _id: id
    }, {
      $inc: {
        watchTimes: 1
      }
    })
    return this.ctx.helper.returnBody(data)
  }
  // 获取文章详情的评论
  async getPostDetail() {
    const { ctx } = this
    const data = await ctx.model.Post.find()
    return ctx.helper.returnBody(data)
  }

  // 上传文件
  async upload() {
    const { ctx } = this
    const stream = await ctx.getFileStream()
    const uploadPath = 'app/public/upload'
    const filename = Date.now()+''+Number.parseInt(Math.random() * 10000) + path.extname(stream.filename)
    const dirname = moment(Date.now()).format('YYYYMMDD')
    const finalPath = path.join(this.config.baseDir, uploadPath, dirname)
    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath)
    }
    const target = path.join(finalPath, filename)
    const writeSteam = fs.createWriteStream(target)
    try {
      await awaitWriteStream(stream.pipe(writeSteam))
    } catch (err) {
      await sendToWormhole(stream)
      throw err
    }
    let obj = {
      poster: path.join('/public/upload', dirname, filename)
    }
    if (Object.keys(stream.fields).length > 0) {
      obj = Object.assign(obj, stream.fields)
    }
    // return ctx.helper.returnBody(path.join('/public/upload', dirname, filename))
    return obj
  }


  // 修改文章
  async updateArticle() {
    const { ctx } = this
    const { poster } =  await this.upload()
    const res = await ctx.model.Post.update({
      _id: Object('5c8a05b4e6c55f1914432998')
    }, {
      $set: {
        poster
      }
    })
    if(res.ok) {
      return ctx.helper.returnBody(res)
    }
  }
  // 发布文章
  async publishArticle() {
    const { ctx } = this
    const { title, content, reprint, label, poster } = await this.upload()
    const labelId = await ctx.model.Label.findOne({
      text: label
    })
    const res = await ctx.model.Post.create({
      content,
      title,
      poster,
      reprint,
      label,
      labelId
    })
    if (!res._id) return ctx.helper.returnBody(null, 201, res)
    return ctx.helper.returnBody(res)
  }
}

module.exports = PostService