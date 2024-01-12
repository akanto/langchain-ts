import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { createRetrievalChain } from 'langchain/chains/retrieval';

import { logger } from '../../utils/logging';
import memoryVectorStore from '../vectorstore/memoryVectorStore';

export const conversationChain = async (chatModel: ChatOpenAI): Promise<string> => {
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

  return finalResult.answer;
};
