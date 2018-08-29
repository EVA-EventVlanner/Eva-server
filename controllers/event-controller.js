const EventModel = require("../models/event-model");
const User = require("../models/user-model");
const Item = require("../models/item-model");
const Debt = require("../models/debt-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const DATE = new Date(2020, 4, 10);
const moment = require("moment");

// id thor 5b8006bb32426203ca2c5a21
// event fo test 5b82bd98ceabcd09bc64e621
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
      .populate('usersWhoInDebt')
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
      location: req.body.location,
      deadlineDate: moment(DATE).format("MMMM Do YYYY"),
      currentBudget: req.body.budget
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

  static async loginEvent(req, res) {
    let eventId = req.params.eventId;
    let userId = req.params.userId;
    console.log(eventId, " ini event id");
    console.log(userId.length, " ini user id");
    try {
      const getModelToCheck = await EventModel.findById({
        _id: eventId
      });
      const isPassword = await bcrypt.compareSync(
        req.body.password,
        getModelToCheck.password
      );
      if (isPassword) {
        let idFound = await getModelToCheck.members.filter(function(member) {
          let temp = JSON.stringify(member);
          let newMember = temp.slice(1, temp.length - 1);
          return newMember === userId;
        });
        if (!idFound.length) {
          // statement
          const GetUser = await User.findById(userId);

          GetUser.events.push(eventId);
          GetUser.role.push("member");
          console.log(GetUser, " ini get User");
          getModelToCheck.members.push(userId);

          const UpdateUser = await User.findByIdAndUpdate(userId, GetUser);
          const UpdateEvent = await EventModel.findByIdAndUpdate(
            eventId,
            getModelToCheck
          );

          res.json({
            message: "Member Baru"
          });
        } else if (idFound.length) {
          res.json({
            message: "Password member lama"
          });
        }
        console.log(idFound);
      } else {
        res.json({
          message: "Password is wrong"
        });
      }
    } catch (err) {
      res.json({
        err
      });
    }
  }

  static async loginEventWithoutPassword(req, res) {
    let eventId = req.params.eventId;
    let userId = req.params.userId;
    try {
      const GetEvent = await EventModel.findById(eventId);
      const FilterId = await GetEvent.members.filter(function(member) {
        let temp = JSON.stringify(member);
        let newMember = temp.slice(1, temp.length - 1);
        return newMember === userId;
      });

      if (!FilterId.length) {
        // statement
        res.json({
          message: "You're not member",
          NeedPassword: true
        });
      } else if (FilterId.length) {
        res.json({
          message: "You're member of this event",
          NeedPassword: false
        });
      }
    } catch (err) {
      res.json({
        err
      });
    }
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

  static async createItemForEvent(req, res) {
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
    try {
      const newItem = await Item.create(obj);
      const getEvent = await EventModel.findById(eventId)
        .populate("admin")
        .populate("items");
      getEvent.items.push(newItem);
      getEvent.currentBudget = getEvent.currentBudget - (newItem.itemPrice * quantity);
      const updateEvent = await EventModel.findByIdAndUpdate(eventId, getEvent);
      res.json({
        newItem,
        getEvent
      });
    } catch (e) {
      res.json({
        message: e
      });
      console.log(e);
    }
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

  static async verifyingItem(req, res) {
    //http://localhost:3000/events/5b85425f36226f1d447c8ef9/item/5b8542dd36226f1d447c8efa/buy/5b85420236226f1d447c8ef8
    let eventId = req.params.eventId;
    let userId = req.params.userId;
    let itemId = req.params.itemId;
    let receiptPrice = req.body.receiptPrice;
    let itemQuantity = req.body.itemQuantity;
    try {
      let getItem = await Item.findById(itemId);
      let getEvent = await EventModel.findById(eventId);
      let getUser = await User.findById(userId);
      if ( getItem.quantity > 0 && getItem.quantity >= itemQuantity) {
        if (receiptPrice < getItem.itemPrice) {
          let debtItem = getItem.itemPrice - (receiptPrice * itemQuantity);
          let obj = {
            eventName: eventId,
            userInDebt: userId,
            itemName: itemId,
            debt: debtItem
          };
          const newDebt = await Debt.create(obj)
          getEvent.usersWhoInDebt.push(newDebt._id)
          getUser.debt.push(newDebt._id)
          // change
          let newItem = getItem
          newItem.quantity = newItem.quantity - itemQuantity
          // getItem.quantity--
          const updateItem = await Item.findByIdAndUpdate(itemId,newItem)
          const updateEvent = await EventModel.findByIdAndUpdate(eventId, getEvent)
          const updateUser = await User.findByIdAndUpdate(userId, getUser)
          res.json({
            newDebt,
            getEvent,
            getUser,
            getItem
          })
        } else {
          getItem.quantity--
          const updateItem = await Item.findByIdAndUpdate(itemId,getItem)
          res.json({
            getEvent,
            message: "work",
            receiptPrice,
            getItem,
          });
        } 
      } else if (getItem.quantity < itemQuantity) {
        res.json({
          message: 'Quota pembelian terlalu banyak',
          disabled: true
        })
      } else {
        res.json({
          message: 'Barang telah habis',
          disabled: true
        })
      }
    } catch (error) {}
  }
}

module.exports = Controller;
