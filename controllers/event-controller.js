const EventModel = require('../models/event-model')
const User = require('../models/user-model')
const Item = require('../models/item-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class Controller {
    static getAllEvent (req,res) {
        EventModel.find()
        .populate('admin')
        .then(events=> {
            res.json({
                message: 'Show all event',
                events
            })
        })
        .catch(err=> {
            res.json({
                message: 'There is some error'
            })
        })
    }

    static getEventById (req,res) {
        let eventId = req.params.eventId
        EventModel.findById(eventId)
        .populate('admin')
        .populate('items')
        .then(event=> {
            res.json({
                message: 'Get one Event',
                event
            })
        })
        .catch(err=> {
            res.json({
                message: 'Can\'t get user'
            })
        })
    }

    static createEvent (req,res) {
        let decoded = jwt.verify(req.headers.token, 'superfox')
        let userId = decoded.userId
        const salt = bcrypt.genSaltSync(7);
        const hash = bcrypt.hashSync(req.body.password, salt);
        let password = hash;

        let obj = {
            eventName: req.body.eventName,
            password: password,
            admin: userId,
            budget: req.body.budget
        }
        let newEvent = new EventModel(obj)
        newEvent.save()
        .then(event=> {
            User.findById(userId)
            .then(user=> {
                user.events.push(event._id)
                user.role.push('admin')
                User.findByIdAndUpdate(userId,user)
                .then(newUser=> {
                    res.json({
                        message: 'Succesfully created new event',
                        event,
                    })
                })
            })
        })
        .catch(err=> {
            res.json({
                message: 'there is some error'
            })
        })
    }

    static deleteEvent (req,res) {
        let eventId = req.params.eventId
        let decoded = jwt.verify(req.headers.token, 'superfox')
        let userId = decoded.userId
        let index = req.body.index
        User.findById(userId)
        .then(user=> {
            console.log(user.events[index])
            user.events.splice(index,1)
            user.role.splice(index,1)
            User.findByIdAndUpdate(userId, user)
            .then(newUpdatedUser=> {
                EventModel.findByIdAndRemove(eventId)
                .then(()=> {
                    res.json({
                        message: 'Succesfully deleted event'
                    })
                })
            })
        })
    }

    static createItemForEvent (req,res) {
        let eventId = req.params.eventId
        let quantity = req.body.quantity
        let obj = {
            itemName: req.body.itemName,
            itemPrice: req.body.itemPrice,
            event: eventId,
            quantity: quantity
        }
        console.log(obj)
        console.log(quantity)
        let newItem = new Item(obj)
        newItem.save()
        .then(item=> {
            EventModel.findById(eventId)
            .then(event=> {
                event.items.push(item._id)
                EventModel.findByIdAndUpdate(eventId, event)
                .then(newEventUpdated=> {
                    res.json({
                        message: 'Succesfully added new Item',
                        item
                    })
                })
            })
        })
    }

    static getOneItem (req,res) {
        let eventId = req.params.eventId
        let itemId = req.params.itemId
        res.json({
            eventId,
            itemId
        })
    }

    static deleteItemForEvent (req,res) {
        let eventId = req.params.eventId
        let itemId = req.params.itemId
        console.log(eventId, itemId)
        res.json({
            eventId,
            itemId
        })
    }
}

module.exports = Controller