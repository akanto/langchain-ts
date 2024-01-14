import tiktoken from 'js-tiktoken';
import { logger } from '../../utils/logging';

const model: tiktoken.TiktokenModel = 'gpt-3.5-turbo';
/**
 * Tokenize a text with the tokenizer of the model. This is a wrapper around js-tiktoken.
 * More info: https://platform.openai.com/tokenizer
 *
 * @param text Text to tokenize
 * @returns Array of token ids
 */
export const tiktokenEncode = (text: string): number[] => {
  const enc = tiktoken.encodingForModel(model);
  const result = enc.encode(text);
  logger.info('Text tokenized: %s, tokens: %s', text, result);
  return result;
};
