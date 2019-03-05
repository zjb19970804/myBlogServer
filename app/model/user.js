module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const UserSchema = new Schema({
    userName: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false
    },
    openId: {
      type: Number
    },
    userSource: {
      type: String,
      defualt: 'local',
      required: true
    }
  })
  return mongoose.model('User', UserSchema)
}