const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = Schema({
    username: String,
    email: String,
    password: String,
    events: [{type: Schema.Types.ObjectId, ref: 'event'}],
    role: [],
    debt: [{type: Schema.Types.ObjectId, ref: 'debt'}]
},{timestamp: true})

let users = mongoose.model('user',userSchema)

module.exports = users