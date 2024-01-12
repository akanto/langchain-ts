# LangChain TypeScript Project

## Project Purpose

This project is for experimenting with LangChain. It provides a practical implementation of the LangChain Quickstart guide and serves as a playground for testing and understanding the capabilities of LangChain.

## Getting Started

Follow the instructions in the [LangChain Quickstart Guide](https://js.langchain.com/docs/get_started/quickstart) to get up and running with this project.

## Prerequisites

You will need the following environment variables set:

- `OPENAI_API_KEY`: Your OpenAI API key.
- `TAVILY_API_KEY`: Your Tavily API key.

## Running the Project

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Run the project with `make start-dev`. This command runs `nodemon`, which is a utility that monitors for any changes in your source code and automatically restarts your server. This is particularly useful during development, as it saves you from having to manually restart your server every time you make changes to your code.

## API Endpoints

The application will listen on port 3003 by default, but this can be reconfigured with the `PORT` environment variable. The application serves the following URLs:

1. http://localhost:3003/api/langchain/simple: This endpoint calls the OpenAI API with a simple prompt.
1. http://localhost:3003/api/langchain/retrieval: This endpoint implements a Retrieval Augmented Generation (RAG) example. The chain behind this endpoint downloads the webpage of LangSmith and generates an answer based on that. It uses in-memory vector embeddings.
1. http://localhost:3003/api/langchain/conversation: This endpoint preserves the conversation history and uses the same Retrieval Augmented Generation (RAG) approach as the above endpoint.
1. http://localhost:3003/api/langchain/search: This endpoint uses Tavily search to answer the question.

## Contributing

Contributions are welcome. Please submit a pull request or create an issue to discuss the changes you want to make.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
