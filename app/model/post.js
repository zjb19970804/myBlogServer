module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const PostSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    updateTime: {
      type: Date,
      default: new Date(),
      required: true
    },
    watchTimes: {
      type: Number,
      default: 0
    },
    reactionNum: {
      type: Number,
      default: 0
    },
    poster: {
      type: String,
      default: 'http://placehold.it/532x200'
    }
  })
  return mongoose.model('Post', PostSchema, 'posts')
}