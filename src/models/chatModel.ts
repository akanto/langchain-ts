import { ChatOpenAI } from '@langchain/openai';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

export const chatModel = (modelName: string): BaseChatModel => {
  if (modelName === 'openai') {
    //return new ChatOpenAI({});
    return new ChatOpenAI({
      modelName: 'gpt-3.5-turbo-1106',
      temperature: 0,
    });
  }

  // Default to Ollama
  return new ChatOllama({
    baseUrl: 'http://localhost:11434', // Default value
    model: 'llama2',
  });
};

export default chatModel;
