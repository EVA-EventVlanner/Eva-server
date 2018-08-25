const EventModel = require("../models/event-model");
const User = require("../models/user-model");
const Item = require("../models/item-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class Controller {
  static getAllEvent(req, res) {
    EventModel.find()
      .populate("admin")
      .populate("items")
      .then(events => {
        res.status(200).json({
          message: "Show all event",
          events: events
        });
      })
      .catch(err => {
        res.json({
          message: "There is some error"
        });
      });
  }

  static getEventById(req, res) {
    let eventId = req.params.eventId;

    EventModel.findById(eventId)
      .populate("admin")
      .populate("items")
      .then(event => {
        res.status(200).json({
          message: "Get one Event",
          event
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Can't get user"
        });
      });
  }

  static createEvent(req, res) {
    console.log("----> create event");

    console.log("headers", req.headers);
    console.log("body", req.body);

    let decoded = jwt.verify(req.headers.token, "superfox");

    console.log(decoded);

    let userId = decoded.userId;
    const salt = bcrypt.genSaltSync(7);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let password = hash;

    let obj = {
      eventName: req.body.eventName,
      password: password,
      admin: userId,
      budget: req.body.budget,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      location: req.body.location
    };

    let newEvent = new EventModel(obj);
    newEvent
      .save()
      .then(event => {
        User.findById(userId).then(user => {
          user.events.push(event._id);
          user.role.push("admin");
          User.findByIdAndUpdate(userId, user).then(newUser => {
            res.json({
              message: "Succesfully created new event",
              event
            });
          });
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "there is some error",
          error: err.message
        });
      });
  }
  static loginEvent(req, res) {
    let eventId = req.params.eventId;
    console.log(eventId, " ini event id");
    EventModel.findById({
      _id: eventId
    })
      .then(event => {
        console.log(event);
        const isPassword = bcrypt.compareSync(
          req.body.password,
          event.password
        );
        if (isPassword) {
          res.status(200).json({
            message: `Sign in success`,
            event
          });
        } else {
          res.json({
            message: "Password is wrong"
          });
        }
      })
      .catch(err => {
        res.json({
          message: "There is some error happen",
          err
        });
      });
  }
  static deleteEvent(req, res) {
    let eventId = req.params.eventId;
    let decoded = jwt.verify(req.headers.token, "superfox");
    let userId = decoded.userId;
    let index = req.body.index;
    User.findById(userId).then(user => {
      console.log(user.events[index]);
      user.role.splice(index, 1);
      User.findByIdAndUpdate(userId, user).then(newUpdatedUser => {
        EventModel.findByIdAndRemove(eventId).then(() => {
          res.json({
            message: "Succesfully deleted event"
          });
        });
      });
    });
  }

  static createItemForEvent(req, res) {
    let eventId = req.params.eventId;
    let quantity = req.body.quantity;
    let obj = {
      itemName: req.body.itemName,
      itemPrice: req.body.itemPrice,
      event: eventId,
      quantity: quantity,
      imageItem: req.body.imageItem
    };
    console.log(obj);
    console.log(quantity);
    let newItem = new Item(obj);
    newItem.save().then(item => {
      EventModel.findById(eventId).then(event => {
        event.items.push(item._id);
        EventModel.findByIdAndUpdate(eventId, event).then(newEventUpdated => {
          res.json({
            message: "Succesfully added new Item",
            item
          });
        });
      });
    });
  }

  static getOneItem(req, res) {
    let itemId = req.params.itemId;
    Item.findById(itemId)
      .populate("items")
      .then(item => {
        res.json({
          message: "Get one item",
          item
        });
      })
      .catch(err => {
        res.json({
          message: err
        });
      });
  }

  static deleteItemFromEvent(req, res) {
    let eventId = req.params.eventId;
    let itemId = req.params.itemId;
    let index = req.params.index;
    console.log(eventId, itemId);
    Item.findByIdAndRemove(itemId).then(() => {
      EventModel.findById(eventId).then(event => {
        event.items.splice(index, 1);
        EventModel.findByIdAndUpdate(eventId, event).then(newEventUpdated => {
          res.json({
            message: "Succesfully delete Item"
          });
        });
      });
    });
  }
}

module.exports = Controller;
