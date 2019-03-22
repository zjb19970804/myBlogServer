module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const PraiseSchema = new Schema({
    userId: String,
    commentId: Schema.Types.ObjectId,
    // ture为赞，false为踩
    actions: Boolean
  })
  return mongoose.model('Praise', PraiseSchema, 'praise')
}