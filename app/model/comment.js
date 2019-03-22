module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const CommentSchema = new Schema({
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'posts'
    },
    // 一级回复，回复文章的
    firstId: {
      type: String,
      default: ''
    },
    // 二级回复，回复评论的
    replyToId: {
      type: String,
      default: ''
    },
    userId: Schema.Types.ObjectId,
    msg: String
  })
  return mongoose.model('Comment', CommentSchema, 'comment')
}