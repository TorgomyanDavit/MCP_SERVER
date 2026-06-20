import { Request, Response } from "express";
import { chat } from "../services/ollama.service";


interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}


// GET /api/chat/:id
export const getChatById = async (
  req: Request,
  res: Response
): Promise<void> => {

  const { id } = req.params;


  const messages: ChatMessage[] = [
    {
      role: "user",
      content: "Hello",
    },
    {
      role: "assistant",
      content: "Hi! How can I help you?",
    },
  ];


  res.status(200).json({
    success: true,
    chatId: id,
    messages,
  });
};



// POST /api/chat
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const { chatId, message } = req.body;


    if (!message) {
      res.status(400).json({
        success: false,
        message: "Message content is required",
      });
      return;
    }


    // const messages: ChatMessage[] = [
    //   // {
    //   //   role: "system",
    //   //   content: "You are a helpful AI assistant.",
    //   // },
    //   {
    //     role: "user",
    //     content,
    //   },
    // ];


    const assistantMessage = await chat(message);



    res.status(200).json({
      success: true,
      chatId,
      userMessage: message,
      assistantMessage,
    });


  } catch (error) {

    console.error(error);


    res.status(500).json({
      success: false,
      message: "AI server error",
    });

  }
};