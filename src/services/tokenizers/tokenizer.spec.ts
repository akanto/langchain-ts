import { expect } from 'chai';
import sinon from 'sinon';
import tiktoken from 'js-tiktoken';
import { tiktokenEncode } from './tokenizer';

describe('tiktokenEncode with stubbing', function () {
  let encodeStub: sinon.SinonStub, logStub: sinon.SinonStub;

  beforeEach(function () {
    encodeStub = sinon.stub().returns([1, 2, 3]);
    const tiktokenMock: tiktoken.Tiktoken = {
      encode: encodeStub,
      decode: sinon.stub(),
    };
    sinon.stub(tiktoken, 'encodingForModel').returns(tiktokenMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should tokenize text and log the result', function () {
    const text = 'Hello, world!';
    const result = tiktokenEncode(text);

    expect(result).to.deep.equal([1, 2, 3]);
    expect(encodeStub.calledWith(text)).to.be.true;
  });
});

describe('tiktokenEncode with calling the real tokenise', function () {
  it('should tokenize text and log the result', function () {
    expect(tiktokenEncode('hello world')).to.deep.equal([15339, 1917]);
    expect(tiktokenEncode('Hello World!')).to.deep.equal([9906, 4435, 0]);
  });
});
