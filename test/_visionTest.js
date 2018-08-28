const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const uriServerVision = 'http://localhost:3000/vision'

let bodyRequest = {
    type: 'consumption'
}

chai.use(chaiHttp)

describe('Vision Testing', function () {
    describe('Route Analyze Link', function () {
        it ('should return 200 when user try to get vision result from link', function (done) {
            chai.request(uriServerVision)
            .post('/analyzelink')
            .send(bodyRequest)
            .end(function (err, result) {
                setTimeout(function () {

                    console.log('ini result : ', result)
                    result.should.have.status(200)
                    
                    done()
                }, 5000)
            })
        })
    })
})