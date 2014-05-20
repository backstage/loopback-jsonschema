require('../support');

var expect = require('chai').expect;
var loopback = require('loopback');
var request = require('supertest');

var loopbackJsonSchema = require('../../index');
var JsonSchema = require('../../lib/models/json-schema');
var jsonSchemaMiddleware = require('../../lib/middleware/json-schema.middleware');

var app = loopback();
app.set('restApiRoot', '/api');
app.use(app.get('restApiRoot'), jsonSchemaMiddleware());
loopbackJsonSchema.init(app);
app.installMiddleware();

describe('GET /collection-schemas/:id', function () {
   describe('when corresponding item schema exists', function () {
        var itemSchema, itemSchemaId;

        before(function (done) {
            JsonSchema.create({
                modelName: 'person',
                collectionName: 'people',
                title: 'Person',
                collectionTitle: 'People',
                type: 'object',
                properties: {}
            }, function(err, jsonSchema) {
                if (err) { throw err };
                itemSchemaId = jsonSchema.id;
                done();
            });
        });

        before(function(done) {
            console.log(itemSchemaId);
            request(app)
                .get('/api/collection-schemas/' + itemSchemaId)
                .expect(200)
                .end(function (err, res) {
                    if (err) { throw err };
                    schemeAndAuthority = 'http://' + res.req._headers.host;
                    itemSchema = res.body;
                    done();
            });
        });

        it('should include $schema', function() {
            expect(itemSchema['$schema']).to.eq('http://json-schema.org/draft-04/hyper-schema#');
        });

        it('should include type', function() {
            expect(itemSchema['type']).to.eq('array');
        });

        it('should include title', function() {
            expect(itemSchema['title']).to.eq('People');
        });

        it('should include properties', function() {
            expect(itemSchema['properties']).to.be.undefined;
        });

        it('should include links', function() {
            expect(itemSchema['links']).to.eql([
                {
                    rel: 'self',
                    href: schemeAndAuthority + '/api/people'
                },
                {
                    rel: 'add',
                    method: 'POST',
                    href: schemeAndAuthority + '/api/people',
                    schema: {
                        $ref: schemeAndAuthority + '/api/json-schemas/' + itemSchemaId
                    }
                }
            ]);
        });

    });

   describe('when corresponding item schema does not exist', function () {
        it('should return 404', function (done) {
            request(app)
                .get('/api/collection-schemas/invalid-schema-id')
                .expect(404)
                .end(function (err, res) {
                    if (err) { throw err };
                    expect(res.body).to.not.be.emtpy;
                    done();
            });
        });
    });
});