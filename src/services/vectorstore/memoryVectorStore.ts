import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

import { logger } from '../../utils/logging';
import cheerioService from '../retrieval/cheerioService';

const embeddings = new OpenAIEmbeddings();

let vectorstore: MemoryVectorStore | null = null;

function getVectorStore(): Promise<MemoryVectorStore> {
  return new Promise(async (resolve, reject) => {
    try {
      if (vectorstore == null) {
        const splitDocs = await cheerioService.load('https://docs.smith.langchain.com/overview');
        vectorstore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
        logger.info('Vector store loaded into the memory');
      }
      resolve(vectorstore);
    } catch (error) {
      reject(error);
    }
  });
}

export default { getVectorStore };
