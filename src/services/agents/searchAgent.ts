import { ChatOpenAI } from '@langchain/openai';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { pull } from 'langchain/hub';
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents';

export const searchAgent = async (chatModel: BaseChatModel, question: string): Promise<string> => {
  const tools = [new TavilySearchResults()];

  // Get the prompt to use - you can modify this!
  // If you want to see the prompt in full, you can at:
  // https://smith.langchain.com/hub/hwchase17/openai-functions-agent
  const agentPrompt = await pull<ChatPromptTemplate>('hwchase17/openai-functions-agent');

  const agent = await createOpenAIFunctionsAgent({
    llm: chatModel,
    tools,
    prompt: agentPrompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  const agentResult = await agentExecutor.invoke({
    input: question,
  });

  return agentResult.output;
};
