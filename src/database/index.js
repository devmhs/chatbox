import mongoose from 'mongoose'

class Database {
  constructor() {
    this.mongo()
  }

  mongo() {
    this.mongo.connection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    })
  }
}

export default new Database()
