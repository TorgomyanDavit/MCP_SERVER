import { Router } from 'express';
import { getChatById, sendMessage } from '../controllers/chat.controller';
import { abortPrompt } from '../services/ollama.service';
import { clearHistory } from '../services/ollama.history';

const router = Router();

router.post('/chat', sendMessage);

router.post('/chat/clear', async (req, res) => {
    clearHistory();
    res.status(200).json({
        success: true,
    });
});

router.get('/chat/:id', getChatById);


router.get('/chat/abort', async (req, res) => {
    await abortPrompt();
    res.status(200).json({
        success: true,
    });
});


export default router;