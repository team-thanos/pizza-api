import app                from '../server/'
import supertest          from 'supertest'
import { expect, should } from 'chai'

/**
 * A complete set of CRUD operation tests for stores.
 *
 * Because we only test the mongoose layer here, testing this gives us good indication that everything is working as expected.
 * All the other routes work exactly the same because they were created using the router factory as well.
 */

const temp = {}
const request = supertest.agent(app.listen())
should()

describe('POST /store', () => {
    it('should add a store', (done) => {
        request.post('/api/store').set('Accept', 'application/json').send({
            name        : "Thanos-Pizza Berlin",
            street      : "Unter den Linden 6",
            postalCode  : "10099",
            city        : "Berlin",
            phoneNumber : "0151/1234567"
        })
        .expect(200, (err, res) => {
            // save the new store id for subsequent tests
            temp.idStore = res.body._id
            done()
        })
    })
})

describe('GET /store', () => {
    it('should get all stores', (done) => {
        request.get('/api/store').expect(200, (err, res) => {
            // expects at least one result because we've just created a store using HTTP POST
            expect(res.body.length).to.be.at.least(1)
            done()
        })
    })
})

describe('GET /store/:id', () => {
    it('should get a store', (done) => {
        request.get(`/api/store/${temp.idStore}`).expect(200, (err, res) => {
            res.body.name.should.equal("Thanos-Pizza Berlin")
            res.body.street.should.equal("Unter den Linden 6")
            res.body.postalCode.should.equal("10099")
            res.body.city.should.equal("Berlin")
            res.body.phoneNumber.should.equal("0151/1234567")
            res.body._id.should.equal(temp.idStore)
            done()
        })
    })
})

describe('PUT /store/:id', () => {
    it('should update a store', (done) => {
        request.put(`/api/store/${temp.idStore}`).set('Accept', 'application/json').send({
            name       : "Thanos-Pizza Adlershof",
            street     : "Rudower Chaussee 26",
            postalCode : "12489",
            phoneNumber: "0209 370081"
        })
        .expect(200, (err, res) => {
            temp.idStore = res.body._id;
            done()
        })
    })

    it('should get updated store', (done) => {
        request.get(`/api/store/${temp.idStore}`).expect(200, (err, res) => {
            res.body.name.should.equal("Thanos-Pizza Adlershof")
            res.body.street.should.equal("Rudower Chaussee 26")
            res.body.postalCode.should.equal("12489")
            res.body.city.should.equal("Berlin") // should remain untouched
            res.body.phoneNumber.should.equal("0209 370081")
            res.body._id.should.equal(temp.idStore)
            done()
        })
    })
})

describe('DELETE /store', () => {
    it('should delete a store', (done) => {
        request.delete(`/api/store/${temp.idStore}`).set('Accept', 'application/json').expect(200, (err, res) => {
            done()
        })
    })

    it('should get error', (done) => {
        // store is no longer available because we removed it 1ns ago ;-)
        request.get(`/api/city/${temp.idStore}`).expect(404, () => {
            done()
        })
    })
})