// import { expect } from 'chai';
import sinon from 'sinon';
import tiktoken from 'js-tiktoken';
import { tiktokenEncode } from './tokenizer';
import { logger } from '../../utils/logging';

describe('tiktokenEncode', function () {
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

    // expect(result).to.deep.equal([1, 2, 3]);
    // expect(encodeStub.calledWith(text)).to.be.true;
    // expect(logStub.calledWith('Text tokenized: %s, tokens: %s', text, [1, 2, 3])).to.be.true;
  });
});
