const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const uriServerUser = 'http://localhost:3000/users'

const requestTimeToOut = 20000

// dummy data to check duplicated username in database user
const registeredUserData = { 
                            username: 'admineva',
                            email: 'admin@eva.com',
                            password: 'admineva' }

// dummy data to test creating new user, change username or disable it after this specific test passed
const registerNewUserData = {
                            username: Math.random().toString(36).substr(2, 9),
                            email: 'admin@eva.com',
                            password: 'admin'
}

// dummy data to delete testing

let tempIdCreated = ''

let unvalidIdtoDelete = '5b7d92fdee8cb4966f38bf24'

chai.use(chaiHttp)

describe('User Testing', function() {
    describe('Route /', function () {
        it('should return status 200 when user route called with GET method in route /', function(done) {
            // this.timeout(requestTimeToOut)
            chai.request(uriServerUser)
            .get('/')
            .end(function(err, result) {
                result.should.have.status(200)
                done()
            })
        })
        
        it('should return all user data in database', function(done) {
            // this.timeout(requestTimeToOut)
            chai.request(uriServerUser)
                .get('/')
                .end(function(err, result) {
                    let users = result.body
                    users.should.be.an('object')
                    users.should.have.own.property('message')
                    users.should.have.own.property('dataUsers')
                    done()
                })
        })
    })

    describe('Route /register', function() {    
        it('should return status 200 when user route called with POST method in route /register', function(done) {
            // this.timeout(requestTimeToOut)
            chai.request(uriServerUser)
                .post('/register')
                .send(registerNewUserData)
                .end(function(err, result) {
                    result.should.have.status(200)
                    result.body.should.have.own.property('created')
                    result.body.created.should.have.own.property('_id')
                    result.body.created.should.have.own.property('username')
                    result.body.created.should.have.own.property('email')
                    result.body.created.should.have.own.property('password')
                    tempIdCreated = result.body.created._id
                    done()
                })
        })

        it('should return status 500 when any try to create user with same username input', function(done) {
            // this.timeout(requestTimeToOut)
            chai.request(uriServerUser)
                .post('/register')
                .send(registeredUserData)
                .end(function(err, result) {
                    result.should.have.status(500)
                    done()
                })
        })

    })

    describe('Route /:id', function() {
        it('should return status 200 when user try to find valid user', function(done) {
            // this.timeout(requestTimeToOut)
            chai.request(uriServerUser)
                .get(`/${tempIdCreated}`)
                .end(function(err, result) {
                    // console.log(result)
                    result.should.have.status(200)
                    result.body.should.have.own.property('user')
                    result.body.user.should.have.own.property('username')
                    result.body.user.should.have.own.property('email')
                    result.body.user.should.have.own.property('password')
                    done()
            })
        })
    })

    describe('Route /login', function() {
        it('should return status 200 when login sucessfull', function(done) {
            // this.timeout(requestTimeToOut)
            chai.request(uriServerUser)
                .post('/login')
                .send({ username: registeredUserData.username, password: registeredUserData.password })
                .end(function(err, result) {
                    // console.log(result.body.token, 'token testing')
                    result.should.have.status(200)
                    result.body.should.have.own.property('token')
                    done()
                })
        })

        it('should return status 500 and specified message - if trying to submit invalid username', function(done) {
            // this.timeout(requestTimeToOut)
            chai.request(uriServerUser)
                .post('/login')
                .send({ username: 'wrong username', password: registeredUserData.password })
                .end(function(err, result) {
                    result.should.have.status(500)
                    done()
                })
        })

        it ('should return status 203 which is not authorized to enter if given invalid password', function(done) {
            // this.timeout(requestTimeToOut)
            chai.request(uriServerUser)
                .post('/login')
                .send({ username: registeredUserData.username, password: 'wrong password' })
                .end(function(err, result) {
                    // console.log(result)
                    result.should.have.status(203)
                    result.body.should.have.own.property('message')
                    result.body.message.should.equal('Invalid password')
                    done()
                })
        })
    })

    describe('Route /delete', function() {
        it('should return status 200 when user try to delete a valid user data', function(done) {
            chai.request(uriServerUser)
                .delete(`/${tempIdCreated}`)
                .end(function(err, result) {
                    result.should.have.status(200)
                    done()
            })
        })

        it('should return status 204 when user try to delete unvalid user data', function(done) {
            // this.timeout(requestTimeToOut)
            chai.request(uriServerUser)
                .delete(`/${unvalidIdtoDelete}`)
                .end(function(err, result) {
                    result.should.have.status(204)
                    done()
            })
        })
    })
})
