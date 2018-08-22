const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const uriServerUser = 'http://localhost:3000/users'

// dummy data to check duplicated username in database user
const registeredUserData = { 
                            username: 'admin',
                            email: 'admin@eva.com',
                            password: 'admin' }

// dummy data to test creating new user, change username or disable it after this specific test passed
const registerNewUserData = {
                            username: 'admin6',
                            email: 'admin@eva.com',
                            password: 'admin'
}


chai.use(chaiHttp)

describe('User Testing', function() {
    describe('Route /', function () {
        it('should return status 200 when user route called with GET method in route /', function(done) {
            chai.request(uriServerUser)
            .get('/')
            .end(function(err, result) {
                result.should.have.status(200)
                done()
            })
        })
        
        it('should return all user data in database', function(done) {
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
            chai.request(uriServerUser)
                .post('/register')
                .send(registerNewUserData)
                .end(function(err, result) {
                    result.should.have.status(200)
                    done()
                })
        })

        it('should return status 500 when any try to create user with same username input', function(done) {
            chai.request(uriServerUser)
                .post('/register')
                .send(registeredUserData)
                .end(function(err, result) {
                    result.should.have.status(500)
                    done()
                })
        })

    })
})