"use strict";

const should = require("should");
const util = require("util");
const BinaryStream = require("node-opcua-binary-stream").BinaryStream;
const LocalizedText = require("..").LocalizedText;

describe("LocalizedText", function () {

    it("should create a LocalizeText", function () {

        const ltext = new LocalizedText({text: "HelloWorld", locale: "en-US"});
        ltext.should.have.property("text");
        ltext.should.have.property("locale");
        ltext.text.should.equal("HelloWorld");
        ltext.locale.should.equal("en-US");

    });

    it("should encode and decode a LocalizeText that have both text and locale", function () {

        const ltext = new LocalizedText({text: "HelloWorld", locale: "en-US"});

        const stream = new BinaryStream();
        stream.length.should.equal(0);

        ltext.encode(stream);

        stream.length.should.be.greaterThan(0);

        const ltext_verif = new LocalizedText();

        stream.rewind();
        ltext_verif.decode(stream);

        ltext_verif.should.eql(ltext);
        ltext_verif.text.should.equal("HelloWorld");
        ltext_verif.locale.should.equal("en-US");


    });

    it("should encode and decode a LocalizeText that have text but no locale", function () {

        const ltext = new LocalizedText({text: "HelloWorld", locale: null});

        ltext.should.have.property("locale");
        should.not.exist(ltext.locale);

        const stream = new BinaryStream();
        stream.length.should.equal(0);

        ltext.encode(stream);

        stream.length.should.be.greaterThan(0);

        const ltext_verif = new LocalizedText();

        stream.rewind();
        ltext_verif.decode(stream);

        ltext_verif.text.should.equal("HelloWorld");
        should.not.exist(ltext_verif.locale);

    });

    it("should encode and decode a LocalizeText that have no text but a locale", function () {

        const ltext = new LocalizedText({text: null, locale: "en-US"});

        ltext.should.have.property("text");
        should.not.exist(ltext.text);

        const stream = new BinaryStream();
        stream.length.should.equal(0);

        ltext.encode(stream);

        stream.length.should.be.greaterThan(0);

        const ltext_verif = new LocalizedText();

        stream.rewind();
        ltext_verif.decode(stream);

        ltext_verif.should.eql(ltext);
        ltext_verif.locale.should.equal("en-US");
        ltext_verif.should.have.property("text");
        should.not.exist(ltext_verif.text);

    });

    const coerceLocalizedText = require("..").coerceLocalizedText;
    it("#coerceLocalizedText - null", function () {

        should.not.exist(coerceLocalizedText(null));
    });
    it("#coerceLocalizedText - string", function () {

        should(coerceLocalizedText("Hello World")).eql(new LocalizedText({locale: null, text: "Hello World"}));
    });
    it("#coerceLocalizedText - LocalizedText", function () {

        should(coerceLocalizedText(new LocalizedText({text: "Hello World"}))).eql(new LocalizedText({locale: null, text: "Hello World"}));
    });

});
