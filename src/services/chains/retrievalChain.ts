import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

import memoryVectorStore from '../vectorstore/memoryVectorStore';

export const retrievalChain = async (chatModel: BaseChatModel, question: string): Promise<string> => {
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
    input: question,
  });

  return result.answer;
};
