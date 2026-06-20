import express from 'express';
import cors from 'cors';

import todoRoutes from './routes/todo.routes';
import chatRoutes from './routes/chat.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', todoRoutes);
app.use('/api', chatRoutes);

export default app;