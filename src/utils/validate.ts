import { logger } from "./logging";

export function validate(): void {
    logger.info("Validating environment variables");
    if (!process.env.OPENAI_API_KEY) {
        logger.error("OPENAI_API_KEY environment variable is not present");
        process.exit(1);
    }
}