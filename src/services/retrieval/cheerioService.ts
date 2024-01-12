import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

import { logger } from '../../utils/logging';

/**
 * Loads documents from a given URL.
 * @param {string} docUrl - The URL of the document e.g. https://docs.smith.langchain.com/overview
 * @returns {Promise<void>} - A promise that resolves when the documents are loaded.
 */
const load = async (docUrl: string): Promise<Document<Record<string, any>>[]> => {
  const loader = new CheerioWebBaseLoader(docUrl);

  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  logger.info('Document loaded and splitted from %s', docUrl);

  return splitDocs;
};

export default { load };
