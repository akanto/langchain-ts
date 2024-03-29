import express from 'express';
import cors from 'cors';
import { morganMiddleware, logger } from './utils/logging';
import langchainRoutes from './routes/langchainRoutes';
import { validate } from './utils/validate';

logger.info('Node version: %s', process.version);

validate();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(morganMiddleware);
// Enable CORS
app.use(cors());

app.use('/api/langchain', langchainRoutes);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
