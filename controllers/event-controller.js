const EventModel = require('../models/event-model')
const User = require('../models/user-model')
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
                user.event.push(event._id)
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
    deleteEvent (req,res) {

    }
}

module.exports = Controller