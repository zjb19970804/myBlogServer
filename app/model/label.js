module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const LabelSchema = new Schema({
    text: {
      type: String,
      default: '其它'
    }
  })
  return mongoose.model('Label', LabelSchema)
}