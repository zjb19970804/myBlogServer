const Service = require('egg').Service;

class UserService extends Service {
  // 获取用户信息
  async accessToken() {
    const code = this.ctx.query.code;
    const path = 'https://github.com/login/oauth/access_token';
    const data = {
      client_id: 'b17fdfd4cd7c3ccf21de',
      client_secret: 'c8246ad4ada94b5c8d0fc3e5ae21ca4b7053b502',
      code: code
    };
    let res = await this.ctx.curl(path, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: data
    })
    // 获取token成功
    if (res.res.status === 200) {
      // 拿到第一步获取的token去请求用户的公开信息
      let userPath = 'https://api.github.com/user'
      const body = await this.ctx.curl(userPath, {
        dataType: 'json',
        data: {
          access_token: res.res.data.access_token
        }
      })
      // 判断是否获取成功
      if (body.status === 200) {
        const userInfo = {
          avatar_url: body.data.avatar_url,
          name: body.data.name
        }
        const openId = body.data.id
        const isSave = await this.ctx.model.User.findOne({openId})
        if(isSave !== null) {
          userInfo.userId = isSave._id
        }else {
          // 创建用户
          await this.ctx.model.User.create({
            userName: userInfo.name,
            avatar: userInfo.avatar_url,
            openId: body.data.id,
            userSource: 'GitHub'
          }, (err, data) => {
            if (err) {
              console.error(err)
            } else {
              userInfo.userId = data._id
            }
          })
        }
        const token = 'Bearer ' + this.createToken(userInfo)
        const returnInfo = {
          avatar: userInfo.avatar_url,
          name: body.data.name,
          token
        }
        return this.ctx.helper.returnBody(returnInfo)
      }else {
        return this.ctx.helper.returnBody(null, 201, body.data.message)
      }
    }else {
      return this.ctx.helper.returnBody(null, 201, res.data.error_description)
    }
  }

  // 获取博客的信息
  async getBloginfo() {
    const { ctx } = this
    const reprintNum = await ctx.model.Post.find({
      reprint: {$ne: ''}
    }).countDocuments()
    const originalNum = await ctx.model.Post.find({
      reprint: ''
    }).countDocuments()
    const labelNum = await ctx.model.Label.countDocuments()
    const obj = {
      reprintNum,
      originalNum,
      labelNum
    }
    return ctx.helper.returnBody(obj)
  }

  /**
   * 生成 Token
   * @param {Object} data
   */
  createToken(data) {
    return this.app.jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: "12h"
    });
  }
  /**
   * 验证token的合法性
   * @param {String} token
   */
  verifyToken(token) {
    return new Promise((resolve, reject) => {
      this.app.jwt.verify(token, this.app.config.jwt.secret, function (err, decoded) {
        let result = {};
        if (err) {
          console.error(err)
          /*
            err = {
              name: 'TokenExpiredError',
              message: 'jwt expired',
              expiredAt: 1408621000
            }
          */
          result.verify = false;
          result.message = err.message;
        } else {
          result.verify = true;
          result.message = decoded;
        }
        resolve(result);
      });
    });
  }
}

module.exports = UserService