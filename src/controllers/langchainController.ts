import { ChatOpenAI } from '@langchain/openai';
import { Request, Response } from 'express';

import { conversationChain } from '../services/chains/conversationChain';
import { retrievalChain } from '../services/chains/retrievalChain';
import { simpleChain } from '../services/chains/simpleChain';
import { searchAgent } from '../services/agents/searchAgent';
import { tiktokenEncode } from '../services/tokenizers/tokenizerService';

import { logger } from '../utils/logging';
import { a } from 'js-tiktoken/dist/core-546a5e47';

export const chatModel = new ChatOpenAI({});

export const tokenize = (req: Request, res: Response): void => {
  try {
    const text = req.query.text as string; // Ensure req.query.text is defined as a string
    const answer = tiktokenEncode(text);
    res.json({ answer: answer });
  } catch (error: any) {
    logger.error('Failed to tokenize: %s', error);
    res.status(500).json({ error: error.message });
  }
};

export const simple = async (req: Request, res: Response): Promise<void> => {
  try {
    // This is a hallucination, because it has no information about the the question
    const answer = await simpleChain(chatModel, 'what is LangSmith?');
    res.json({ answer: answer });
  } catch (error) {
    logger.error('Failed to process simple chain', error);
    res.status(500).json({ error: error });
  }
};

export const retrieval = async (req: Request, res: Response): Promise<void> => {
  try {
    const answer = await retrievalChain(chatModel, 'what is LangSmith?');
    res.json({ answer: answer });
  } catch (error) {
    logger.error('Failed to process retrieval chain', error);
    res.status(500).json({ error: error });
  }
};

export const conversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const answer = await conversationChain(chatModel);
    res.json({ answer: answer });
  } catch (error) {
    logger.error('Failed to process conversation chain', error);
    res.status(500).json({ error: error });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    //const answer = await searchAgent('what is LangSmith?');
    const answer = await searchAgent('what is Cloudera Cloudbreak?');
    res.json({ answer: answer });
  } catch (error) {
    logger.error('Failed to process search agent', error);
    res.status(500).json({ error: error });
  }
};
