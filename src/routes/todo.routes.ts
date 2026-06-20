import { Router } from 'express';
import {
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosRespons,
} from '../controllers/todo.controller';

const router = Router();

router.get('/todos', getTodosRespons);
router.get('/todos/:id', getTodoById);
router.post('/todos', createTodo);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);

export default router;