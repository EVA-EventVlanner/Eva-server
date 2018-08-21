const mongoose = require('mongoose')
const Schema = mongoose.Schema

let eventSchema = Schema({
    eventName: String,
    password: String,
    admin: {type: Schema.Types.ObjectId, ref: 'user'},
    budget: Number,
    items: [{type: Schema.Types.ObjectId, ref: 'item'}],
    purchasedItems: [],
    usersWhoInDebt: [{userId: '213412124', debt: 1000}]
},{timestamp: true})

let events = mongoose.model('user',eventSchema)

module.exports = events