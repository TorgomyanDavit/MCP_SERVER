import { Request, Response } from 'express';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  description?: string
}

let todos: Todo[] = [
  {
    id: 1,
    title: 'Red Rose',
    completed: false,
    description: 'A romantic flower with deep red petals.'
  },
  {
    id: 2,
    title: 'White Tulip',
    completed: false,
    description: 'An elegant white tulip symbolizing purity.'
  },
  {
    id: 3,
    title: 'Pink Lily',
    completed: false,
    description: 'A fragrant flower with delicate pink blooms.'
  }
];

export const getTodos = async () => {
  return todos
}

export const getTodosRespons = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json(todos);
};

export const getTodoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    res.status(404).json({
      success: false,
      message: 'Todo not found',
    });
    return;
  }

  res.status(200).json(todo);
};

export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({
      success: false,
      message: 'Title is required',
    });
    return;
  }

  const todo: Todo = {
    id: Date.now(),
    title,
    completed: false,
  };

  todos.push(todo);

  res.status(201).json(todo);
};

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    res.status(404).json({
      success: false,
      message: 'Todo not found',
    });
    return;
  }

  todo.title = req.body.title ?? todo.title;
  todo.completed =
    req.body.completed ?? todo.completed;

  res.status(200).json(todo);
};

export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  todos = todos.filter((item) => item.id !== id);

  res.status(200).json({
    success: true,
    message: 'Todo deleted',
  });
};