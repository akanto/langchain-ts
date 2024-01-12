import { Request, Response } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

import { simpleChain } from '../services/chains/simpleChain';

import { logger } from '../utils/logging';
import memoryVectorStore from '../services/vectorstore/memoryVectorStore';

const chatModel = new ChatOpenAI({});

export const simple = async (req: Request, res: Response): Promise<void> => {
  try {
    // This is a hallucination, because it has no information about the the question
    const answer = await simpleChain(chatModel, 'what is LangSmith?');
    res.json({ answer: answer });
  } catch (error) {
    logger.error('Failed to load tests', error);
    res.status(500).json({ error: error });
  }
};

export const retrieval = async (req: Request, res: Response): Promise<void> => {
  try {
    const vectorstore = await memoryVectorStore.getVectorStore();
    const retriever = vectorstore.asRetriever();

    const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
    <context>
    {context}
    </context>

    Question: {input}`);

    const documentChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever,
    });

    const result = await retrievalChain.invoke({
      input: 'what is LangSmith?',
    });

    res.json({ answer: result.answer });
  } catch (error) {
    logger.error('Failed to load tests', error);
    res.status(500).json({ error: error });
  }
};

export const conversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const vectorstore = await memoryVectorStore.getVectorStore();
    const retriever = vectorstore.asRetriever();

    logger.info('Create a conversation!');

    const historyAwarePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder('chat_history'),
      ['user', '{input}'],
      ['user', 'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation'],
    ]);

    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
      llm: chatModel,
      retriever,
      rephrasePrompt: historyAwarePrompt,
    });

    const chatHistory = [new HumanMessage('Can LangSmith help test my LLM applications?'), new AIMessage('Yes!')];

    const documents = await historyAwareRetrieverChain.invoke({
      chat_history: chatHistory,
      input: 'Tell me how!',
    });

    logger.info('documents: %o', documents);

    const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
      ['system', "Answer the user's questions based on the below context:\n\n{context}"],
      new MessagesPlaceholder('chat_history'),
      ['user', '{input}'],
    ]);

    const historyAwareCombineDocsChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt: historyAwareRetrievalPrompt,
    });

    const conversationalRetrievalChain = await createRetrievalChain({
      retriever: historyAwareRetrieverChain,
      combineDocsChain: historyAwareCombineDocsChain,
    });

    const finalResult = await conversationalRetrievalChain.invoke({
      chat_history: [new HumanMessage('Can LangSmith help test my LLM applications?'), new AIMessage('Yes!')],
      input: 'tell me how',
    });

    res.json({ answer: finalResult.answer });
  } catch (error) {
    logger.error('Failed to load tests', error);
    res.status(500).json({ error: error });
  }
};
