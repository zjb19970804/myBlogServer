module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const CommentChild = new Schema({
    avatar: {
      type: String,
      default: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    userName: String,
    msg: String,
    like: Number,
    dislike: Number,
    reply: Array
  })
  const CommentSchema = new Schema({
    postId: {
      type: String
    },
    reactionNum: {
      type: Number,
      default: 0
    },
    CommentList: {
      type: Array,
      default: [CommentChild],
    }
  })
  return mongoose.model('Comment', CommentSchema, 'comment')
}