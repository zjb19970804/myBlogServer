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
    watchTimes: {
      type: Number,
      default: 0
    },
    poster: {
      type: String,
      default: 'http://placehold.it/532x200'
    },
    label: {
      type: String,
      default: '其它'
    },
    labelId: mongoose.Types.ObjectId,
    reprint: {
      type: String,
      default: ''
    }
  })
  return mongoose.model('Post', PostSchema, 'posts')
}