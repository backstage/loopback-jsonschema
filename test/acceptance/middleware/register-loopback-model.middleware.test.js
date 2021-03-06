var support = require('../../support');

var expect = require('chai').expect;
var loopback = require('loopback');
var request = require('supertest');

describe('register-loopback-model.middleware', function() {
    it('should register the loopback model', function (done) {
        var app = support.newLoopbackJsonSchemaApp();
        request(app)
            .post('/api/item-schemas')
            .set('Content-Type', 'application/json')
            .send('{"collectionName": "people"}')
            .expect(200)
            .end(function (err, res) {
                var body = JSON.parse(res.text);
                expect(body.collectionName).to.eq('people');

                request(app)
                    .post('/api/people')
                    .set('Content-Type', 'application/json')
                    .send('{"name": "test"}')
                    .expect(200)
                    .end(function (err, res) {
                        var body = JSON.parse(res.text);
                        expect(body.name).to.eq('test');
                        done();
                    });
            });
    });
});
