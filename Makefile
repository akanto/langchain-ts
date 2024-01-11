.PHONY: format install-deps start-dev

# Set dev-start as the default target
.DEFAULT_GOAL := start-dev

format:
	npx prettier . --write

install-deps:
	npm install

start-dev:
	npm run dev server.js

