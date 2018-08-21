const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class Controller {
    static getUsers(req,res) {
        User.find()
        .then(dataUsers=> {
            res.json({
                message: 'data all users',
                dataUsers
            })
        })
        .catch(err=> {
            res.json({
                err
            })
        })
    }
    static register(req,res) {
        let username = req.body.username
        let email = req.body.email
        User.findOne({username})
        .then(found=> {
            if (found) {
                res.status(500).json({
                    message: 'username Used'
                })
            }
            else{
                const salt = bcrypt.genSaltSync(7);
                const hash = bcrypt.hashSync(req.body.password, salt);
                let password = hash;
                User.create({
                    username,
                    email,
                    password
                })
                .then(user=> {
                    res.status(200).json({
                        message: "successfully sign up",
                        user
                    });
                })
            }
        })
        .catch(err=> {
            res.json({
                err: err.message
            })
        })
    }
}