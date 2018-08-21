const mongoose = require('mongoose')
const Schema = mongoose.Schema

let itemSchema = Schema({
    itemName: String,
    itemPrice: Number,
    itemQuantity: Number,
    eventName: {type: Schema.Types.ObjectId, ref: 'event'},
},{timestamp: true})

let items = mongoose.model('item',itemSchema)

module.exports = items