const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const uriServerEvents = 'http://localhost:3000/events'

chai.use(chaiHttp)

const requestTimeToOut = 20000

const newEventData = {
    eventName: 'Chai test',
    password: 'Chai test',
    admin: 'Chai test',
    budget: 10000000
}

const dummyHeader = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YjdlYTc4OTNlNDgyNGJjZTRhZTFiZTYiLCJpYXQiOjE1MzUwMjcwODN9.sDfwLIQulYZEcAJ5zwWRIShYQQooTGDVIWtK40cneb0'
}

describe('Event Testing', function() {
    describe('Route / with method GET', function() {
        it('should return 200 when passed', function(done) {
            this.timeout(requestTimeToOut)
            chai.request(uriServerEvents)
                .get('/')
                .end(function(err, result) {
                    result.should.have.status(200)
                    done()
                })
        })

        it('should have property events', function(done) {
            this.timeout(requestTimeToOut)
            chai.request(uriServerEvents)
                .get('/')
                .end(function(err, result) {
                    // console.log(result.body.events[0])
                    result.body.should.have.own.property('events')
                    done()
                })
        })

        it('event attribute should have properties id, items, eventName and password', function(done) {
            this.timeout(requestTimeToOut)
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

    describe('Route /:id', function() {
        it('should return 200 when get a single event', function() {
            this.timeout(requestTimeToOut)
            chai.request(uriServerEvents)
                .get('/5b7ea7853e4824bce4ae1be4')
                .end(function(err, result) {
                    result.should.have.status(200)
                    done()
                })
        })
        
        it('should have property event', function() {
            this.timeout(requestTimeToOut)
            chai.request(uriServerEvents)
                .get('/5b7ea7853e4824bce4ae1be4')
                .end(function(err, result) {
                    result.should.have.own.property('event')
                    done()
                })
        })
    })

    describe('Event - Route GET /item/:id', function() {
            this.timeout(requestTimeToOut)
            it('should return 200 to get item in specified event', async function() {
                let response = await chai.request(uriServerEvents).get('/item/5b7ea7853e4824bce4ae1be4')

                response.body.should.have.own.property('item')
            })
    })
})