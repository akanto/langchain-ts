import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { validate } from './validate';
import { logger } from './logging';

describe('validate', () => {
  process.env = {};

  let exitStub: SinonStub, errorLogStub: SinonStub;

  beforeEach(() => {
    exitStub = sinon.stub(process, 'exit');
    errorLogStub = sinon.stub(logger, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('logs error and exits if OPENAI_API_KEY is not present', () => {
    validate();
    expect(errorLogStub.calledWith('OPENAI_API_KEY environment variable is not present')).to.be.true;
    expect(exitStub.calledWith(1)).to.be.true;
  });

  it('logs error and exits if TAVILY_API_KEY is not present', () => {
    process.env.OPENAI_API_KEY = 'test';
    validate();
    expect(errorLogStub.calledWith('TAVILY_API_KEY environment variable is not present')).to.be.true;
    expect(exitStub.calledWith(1)).to.be.true;
  });

  it('should pass if all env variables are present', () => {
    process.env.OPENAI_API_KEY = 'test';
    process.env.TAVILY_API_KEY = 'test';
    validate();
    expect(exitStub.calledWith(1)).to.be.false;
  });
});
