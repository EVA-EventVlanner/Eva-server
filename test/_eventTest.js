const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const uriServerEvents = 'http://localhost:3000/events'

chai.use(chaiHttp)

const newEventData = {
    eventName: 'Chai test',
    password: 'Chai test',
    admin: 'Chai test',
    budget: 'Chai test'
}

const dummyHeader = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YjdkNzNlNzdmODYwNjhlYzI0MzEwNGUiLCJpYXQiOjE1MzUwMTg1NTZ9.r9ZIygfs1zNTiTMpOFXkMKm1tPWkn4W410rVc4BffYo'
}

describe('Event Testing', function() {
    describe('Route / with method GET', function() {
        it('should return status 200 when (getAllEvents) approached', function(done) {
            chai.request(uriServerEvents)
                .get('/')
                .end(function(err, result) {
                    result.should.have.status(200)
                    done()
                })
        })

        it('should have property events', function(done) {
            chai.request(uriServerEvents)
                .get('/')
                .end(function(err, result) {
                    // console.log()
                    result.body.should.have.own.property('events')
                    done()
                })
        })

        it('event attribute should be an array (of objects)', function(done) {
            chai.request(uriServerEvents)
                .get('/')
                .end(function(err, result) {
                    result.body.events.should.be.an('array')
                    done()
                })
        })

        it('event attribute should be an array (of objects)', function(done) {
            chai.request(uriServerEvents)
                .get('/')
                .end(function(err, result) {
                    if (result.body.events) {
                        let events = result.body.events[0]
                        events.should.have.own.property('_id')
                        events.should.have.own.property('items')
                        events.should.have.own.property('eventName')
                        events.should.have.own.property('password')
                    }

                    done()
                })
        })
    })

    describe('Route / with method POST', function() {
        describe('should return 200 when approached with http get method to route /<eventId>', function(done) {
            chai.request(uriServerEvents)
                .get(`/`)
                .send(newEventData, dummyHeader)
                .end(function(err, result) {
                    // console.log(result.body)
                    done()
                })
        })
    })


    // describe('Route /:id to find event by it\'s _id attribute', function() {
    //     describe('should return 200 when approached with http get method to route /<eventId>', function(done) {
    //         chai.request(uriServerEvents)
    //             .get(`/${}`)
    //     })
    // })
})