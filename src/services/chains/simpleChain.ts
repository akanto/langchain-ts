import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

export const simpleChain = async (chatModel: BaseChatModel, question: string): Promise<string> => {
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are a world class technical documentation writer.'],
    ['user', '{input}'],
  ]);

  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(chatModel).pipe(outputParser);

  const answer = await chain.invoke({
    input: question,
  });

  return answer;
};
