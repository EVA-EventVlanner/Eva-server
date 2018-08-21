const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class Controller {
    static getUsers(req,res) {
        User.find()
        .populate('event')
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
                .catch(err=> {
                    res.json({
                        err: 'Signup Failed'
                    })
                })
            }
        })
        .catch(err=> {
            res.json({
                err: err.message
            })
        })
    }
    static login(req,res){
        console.log(req.body)
        User.findOne({username: req.body.username})
        .then(found =>{
            console.log(found.password,'ini found')
            if (found.length!==0) {  
                const isPassword = bcrypt.compareSync(req.body.password,found.password)
                if(isPassword){
                    console.log(isPassword,'ini mauk gka')
                    const token = jwt.sign({userId: found._id},`superfox`)
                    res.status(200).json({
                        message: `Sign in success`,
                        token,
                        found
                    })
                }
                else {
                    res.status(500).json({
                        message: `username/password wrong`
                    })
                }
            }
            else {
                req.status(500).json({
                    message: `username/password wrong`
                })
            }
        })
        .catch(err =>{
            console.log(err)
            res.status(500).json({
                message: 'duh  error patrick'
            })
            console.log(err)
        })
    }
}

module.exports = Controller