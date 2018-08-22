const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class Controller {
    static getUsers(req,res) {
        User.find()
        .populate('events')
        .then(dataUsers=> {
            res
                .status(200)
                .json({
                message: 'data all users',
                dataUsers
            })
        })
        .catch(err=> {
            res
                .status(500)
                .json({
                err
            })
        })
    }

    static getUserById(req,res) {
        let userId = req.params.id
        User.findById(userId)
        .populate('events')
        .then(user=> {
            res
                .status(200)
                .json({
                message: 'Get one user',
                user
            })
        })
        .catch( (err) => {
            res
                .status(500)
                .json({
                message: err.message
            })
        })
    }
    
    static register(req,res) {
        
        let username = req.body.username
        let email = req.body.email

        console.log(username, 'username diterima server')

        User.findOne({ username: username })
        .then( (found) => {

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
                    res
                        .status(200)
                        .json({
                        message: "successfully sign up",
                        created: user
                    });
                })
                .catch(err=> {
                    res
                        .status(500)
                        .json({
                        err: 'Signup Failed'
                    })
                })
            }
        })
        .catch(err=> {
            console.log('error nih')
            res
                .status(500)
                .json({
                err: err.message
            })
        })
    }

    static login(req,res){
        console.log(req.body)
        User.findOne({ username: req.body.username })
        .then( (found) =>{
            console.log(found.password,'ini found')
            
            if (found.length!==0) {
                const isPassword = bcrypt.compareSync(req.body.password,found.password)
                
                if (isPassword) {
                    console.log(isPassword,'ini mauk gka')
                    const token = jwt.sign({userId: found._id},`superfox`)
                    res.status(200).json({
                        message: `Sign in success`,
                        token,
                        found
                    })
                }
                else {
                    res.status(203).json({
                        message: `Invalid password`
                    })
                }
            }
            else {
                req.status(203).json({
                    message: `Invalid username`
                })
            }
        })
        .catch( (err) => {
            res.status(500).json({
                message: err.message
            })
        })
    }

    static deleteUserById(req, res) {
        let userId = req.params.id
        User.findById(userId)
        .then( (user) => {
            if (user) {
                User.deleteOne({ _id : userId })
                .then( (response) => {
                    res
                        .status(200)
                        .send({ message: 'deleted',
                                response: response })
                })
                .catch( (err) => {
                    console.log('1')
                    res
                        .status(500)
                        .send({
                            error: err.message
                        })
                })
            } else {
                res
                .status(204)
                .send({
                    message: 'No user found',
                })
            }
        })
        .catch( (err) => {
            console.log('2')
            res
                .status(500)
                .send({
                    message: err.message
                })
        })
    }
}

module.exports = Controller