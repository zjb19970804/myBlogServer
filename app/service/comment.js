const Service = require('egg').Service;
const ObjectId = require('mongoose').Types.ObjectId

class CommentService extends Service {
  // 获取文章详情的评论
  async getPostComment() {
    const { ctx } = this
    return ctx.helper.returnBody(await this.pagingQuery())
  }

  // 分页
  async pagingQuery() {
    const { ctx } = this
    const data = await ctx.model.Comment.aggregate([
      {
        $match: {
          "postId": ObjectId(ctx.query.id),
          "replyToId": ''
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'praise',
          localField: '_id',
          foreignField: 'commentId',
          as: 'praise'
        }
      },
      {
        $project: {
          praise: 1,
          msg: 1,
          postId: 1,
          reply: 1,
          _id: 1,
          userInfo: {
            avatar: 1,
            _id: 1,
            userName: 1
          }
        }
      },
      {
        $unwind: "$userInfo"
      }
    ])
    // 检查是否登录 start
    let userPraise = []
    const tokenData = await ctx.helper.verifyToken(ctx)
    if (tokenData.verify) {
      const { userId } = tokenData.message
      const isUser = await ctx.model.Praise.find({
        userId
      })
      if(isUser.length > 0) {
        userPraise = userPraise.concat(isUser)
      }
    }
    // 检查是否登录 end

    // 整理数据 start
    const promiseArr = data.map(async (i) => {
      i.like = 0
      i.dislike = 0
      i.isAction = -1
      // 计算点赞的数和踩的数
      i.praise.forEach(j => {
        j.actions ? i.like++ : i.dislike++
      })
      delete i.praise

      // 查询当前用户操作过哪些评论
      const index = userPraise.findIndex((item) => {
        return item.commentId.toString() === i._id.toString()
      })
      if(index !== -1) {
        i.isAction = ~~userPraise[index].actions
      }

      // 获取二级评论
      const replyData = await ctx.model.Comment.aggregate([
        {
          $match: {
            $or: [
              {
                "replyToId": i._id.toString()
              },
              {
                "firstId": i._id.toString()
              }
            ]
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $lookup: {
            from: 'praise',
            localField: '_id',
            foreignField: 'commentId',
            as: 'praise'
          }
        },
        {
          $project: {
            praise: 1,
            msg: 1,
            postId: 1,
            _id: 1,
            firstId: 1,
            replyToId: 1,
            userInfo: {
              avatar: 1,
              _id: 1,
              userName: 1
            }
          }
        },
        {
          $unwind: "$userInfo"
        }
      ])
      const promisReply = replyData.map(async replyItem => {
        replyItem.like = 0
        replyItem.dislike = 0
        replyItem.isAction = -1
        // 计算点赞的数和踩的数
        replyItem.praise.forEach(j => {
          j.actions ? replyItem.like++ : replyItem.dislike++
        })
        delete replyItem.praise
        const index = userPraise.findIndex((item) => {
          return item.commentId.toString() === replyItem._id.toString()
        })
        if (index !== -1) {
          replyItem.isAction = ~~userPraise[index].actions
        }
        replyItem.beReplied = await this.getCommentUser(replyItem._id)
        return replyItem
      })
      const nowReply = await Promise.all(promisReply)
      i.reply = [].concat(nowReply)
      return i
    });
    const now = await Promise.all(promiseArr)
    // 整理数据 end

    // 查询总数
    const total = await ctx.model.Comment.find({
      "postId": ObjectId(ctx.query.id),
      "replyToId": ''
    }).count()
    return {
      data: now,
      total
    }
  }

  // 根据评论id查询评论的用户信息
  async getCommentUser(commentId) {
    const { ctx } = this
    const [res] = await ctx.model.Comment.aggregate([
      {
        $match: {
           _id: Object(commentId)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $project: {
          userId: 1,
          _id: 0,
          userName: '$userInfo.userName',
          avatar: '$userInfo.avatar'
        }
      }
    ])
    return res
  }

  // 递归获取评论数据  无限向下嵌套回复，本人已弃用
  // async CollatingData(arr, userPraise) {
  //   const { ctx } = this
  //   const promiseArr = arr.map(async (i) => {
  //     i.like = 0
  //     i.dislike = 0
  //     i.isAction = -1
  //     // 计算点赞的数和踩的数
  //     i.praise.forEach(j => {
  //       j.actions ? i.like++ : i.dislike++
  //     })
  //     delete i.praise
  //     // 获取二级评论
  //     const replyData = await ctx.model.Comment.aggregate([
  //       {
  //         $match: {
  //           "replyToId": i._id.toString()
  //         }
  //       },
  //       {
  //         $lookup: {
  //           from: 'users',
  //           localField: 'userId',
  //           foreignField: '_id',
  //           as: 'userInfo'
  //         }
  //       },
  //       {
  //         $lookup: {
  //           from: 'praise',
  //           localField: '_id',
  //           foreignField: 'commentId',
  //           as: 'praise'
  //         }
  //       },
  //       {
  //         $project: {
  //           praise: 1,
  //           msg: 1,
  //           postId: 1,
  //           _id: 1,
  //           userInfo: {
  //             avatar: 1,
  //             _id: 1,
  //             userName: 1
  //           }
  //         }
  //       },
  //       {
  //         $unwind: "$userInfo"
  //       }
  //     ])
  //     i.reply = [].concat(replyData)
  //     // 计算登录的用户对那些评论点赞或踩过
  //     const index = userPraise.findIndex((item) => {
  //       return item.commentId.toString() === i._id
  //     })
  //     if(index !== -1) {
  //       i.isAction = ~~userPraise[index].actions
  //     }
  //     // userPraise.forEach(j => {
  //     //   const index = now.findIndex((value) => {
  //     //     return value._id.toString() === j.commentId.toString()
  //     //   })
  //     //   now[index].isAction = ~~j.actions
  //     // })
  //     if (replyData.length > 0) {
  //       await this.CollatingData(i.reply, userPraise)
  //     }
  //     return i
  //   });
  //   return await Promise.all(promiseArr)
  // }

  // 对文章评论
  async commentsArticles() {
    const { ctx } = this
    let { postId, msg, replyToId, firstId } = ctx.request.body
    // 检验token
    const data = await ctx.helper.verifyToken(ctx)
    if (!data.verify) return ctx.helper.loginFailure()
    const { userId } = data.message
    const res = await ctx.model.Comment.create({
        userId: ObjectId(userId),
        firstId: firstId,
        replyToId: replyToId,
        postId: ObjectId(postId),
        msg
      })
    if (res._id || res.ok) {
      return ctx.helper.returnBody()
    } else {
      console.error(res)
      return ctx.helper.returnBody(null, 201, res)
    }
  }
}

module.exports = CommentService