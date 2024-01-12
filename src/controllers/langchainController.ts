import { Request, Response } from 'express';
import { logger } from '../utils/logging';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const chatModel = new ChatOpenAI({});

export const test = async (req: Request, res: Response): Promise<void> => {
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
    }
};