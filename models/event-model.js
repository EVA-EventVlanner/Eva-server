const mongoose = require('mongoose')
const Schema = mongoose.Schema

let eventSchema = Schema({
    eventName: String,
    password: String,
    admin: {type: Schema.Types.ObjectId, ref: 'user'},
    budget: Number,
    items: [{type: Schema.Types.ObjectId, ref: 'item'}],
    purchasedItems: [],
    usersWhoInDebt: [{type: Schema.Types.ObjectId, ref: 'user'}]
},{timestamp: true})

let events = mongoose.model('event',eventSchema)

module.exports = events