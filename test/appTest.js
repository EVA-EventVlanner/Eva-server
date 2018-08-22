const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()

chai.use(chaiHttp)

describe('App Testing', function() {
    it('should return status 200 when app started', function(done) {
        chai.request('http://localhost:3000')
            .get('/')
            .end(function(err, result) {
                result.should.have.status(200)
                done()
            })
    })
})