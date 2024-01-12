import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { pull } from 'langchain/hub';
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents';

export const searchAgent = async (question: string): Promise<string> => {
  const searchTool = new TavilySearchResults();
  const tools = [searchTool];

  // Get the prompt to use - you can modify this!
  // If you want to see the prompt in full, you can at:
  // https://smith.langchain.com/hub/hwchase17/openai-functions-agent
  const agentPrompt = await pull<ChatPromptTemplate>('hwchase17/openai-functions-agent');

  const agentModel = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-1106',
    temperature: 0,
  });

  const agent = await createOpenAIFunctionsAgent({
    llm: agentModel,
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
