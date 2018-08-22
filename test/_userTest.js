const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const uriServerUser = 'http://localhost:3000/users'

chai.use(chaiHttp)

describe('User Testing', function() {
    
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