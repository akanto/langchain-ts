import { Request, Response } from 'express';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';

import { logger } from '../utils/logging';
import memoryVectorStore from '../services/vectorstore/memoryVectorStore';

const chatModel = new ChatOpenAI({});

export const llmchain = async (req: Request, res: Response): Promise<void> => {
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', 'You are a world class technical documentation writer.'],
      ['user', '{input}'],
    ]);

    const outputParser = new StringOutputParser();

    const chain = prompt.pipe(chatModel).pipe(outputParser);

    const answer = await chain.invoke({
      input: 'what is LangSmith?',
    });

    res.json({ answer: answer });
  } catch (error) {
    logger.error('Failed to load tests', error);
    res.status(500).json({ error: error });
  }
};

export const retrieval = async (req: Request, res: Response): Promise<void> => {
  try {
    const vectorstore = await memoryVectorStore.getVectorStore();

    const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
    <context>
    {context}
    </context>

    Question: {input}`);

    const documentChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
    });

    const retriever = vectorstore.asRetriever();

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
