require('../../support');

var expect = require('chai').expect;

var schemaLinkRewriter = require('../../../lib/http/schema-link-rewriter');

describe('schemaLinkRewriter', function() {
    var body;
    var baseUrl = 'http://example.org';
    var originalBody;

    beforeEach(function() {
        originalBody = {};
    });

    describe('when links href is relative', function() {
        beforeEach(function() {
            originalBody.links = [
                { href: '/relative' }
            ];

            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should make href absolute', function() {
            expect(body.links[0].href).to.eq('http://example.org/relative');
        });
    });


    describe('when links href is absolute', function() {
        beforeEach(function() {
            originalBody.links = [
                { href: 'http://example.org/absolute' }
            ];

            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should do nothing', function() {
            expect(body.links[0].href).to.eq('http://example.org/absolute');
        });
    });

    describe('when links $ref is relative', function() {
        beforeEach(function() {
            originalBody.links = [
                { schema: { $ref: '/relative' } }
            ];
            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should make schema.$ref absolute', function() {
            expect(body.links[0].schema.$ref).to.eq('http://example.org/relative');
        });
    });

    describe('when links $ref is absolute', function() {
        beforeEach(function() {
            originalBody.links = [
                { schema: { $ref: 'http://example.org/absolute' } }
            ];
            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should do nothing', function() {
            expect(body.links[0].schema.$ref).to.eq('http://example.org/absolute');
        });
    });

    describe('when properties $ref is relative', function() {
        beforeEach(function() {
            originalBody.properties = {
                items: { $ref: '/relative' }
            };
            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should make schema.$ref absolute', function() {
            expect(body.properties.items.$ref).to.eq('http://example.org/relative');
        });
    });

    describe('when properties $ref is absolute', function() {
        beforeEach(function() {
            originalBody.properties = {
                items: { $ref: 'http://example.org/absolute' }
            };
            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should do nothing', function() {
            expect(body.properties.items.$ref).to.eq('http://example.org/absolute');
        });
    });

    describe('when items $ref is relative', function() {
        beforeEach(function() {
            originalBody.items = { $ref: '/relative' };
            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should make schema.$ref absolute', function() {
            expect(body.items.$ref).to.eq('http://example.org/relative');
        });
    });

    describe('when items $ref is absolute', function() {
        beforeEach(function() {
            originalBody.items = { $ref: 'http://example.org/absolute' };
            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should do nothing', function() {
            expect(body.items.$ref).to.eq('http://example.org/absolute');
        });
    });

    describe('when links, properties and items do not exist', function() {
        beforeEach(function() {
            originalBody.links = undefined;
            originalBody.properties = undefined;
            originalBody.items = undefined;
            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should do nothing', function() {
            expect(body.links).to.be.undefined;
            expect(body.properties).to.be.undefined;
            expect(body.items).to.be.undefined;
        });
    });

    describe('when no keys with url exist', function() {
        beforeEach(function() {
            originalBody.links = [{}];
            originalBody.properties = {};
            originalBody.items = {};
            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should do nothing', function() {
            expect(body.links[0]).to.eql({});
            expect(body.properties).to.eql({});
            expect(body.items).to.eql({});
        });
    });

    describe('when href is a child of something other than links', function() {
        beforeEach(function() {
            originalBody.properties = {
                href: '/relative'
            };
            originalBody.items = {
                href: '/relative'
            };
            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should do nothing', function() {
            expect(body.properties.href).to.eq('/relative');
            expect(body.items.href).to.eq('/relative');
        });
    });

    describe('when $ref is a child of something other than links, properties or items', function() {
        beforeEach(function() {
            originalBody.something = {
                $ref: '/relative'
            };
            body = schemaLinkRewriter(baseUrl, originalBody);
        });

        it('should do nothing', function() {
            expect(body.something.$ref).to.eq('/relative');
        });
    });
});
