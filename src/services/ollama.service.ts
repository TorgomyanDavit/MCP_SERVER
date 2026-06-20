import ollama from 'ollama';
import { getHistory, pushHistory } from './ollama.history';
import { getTodos } from '../controllers/todo.controller';
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// export interface ChatMessage {
//   role: 'system' | 'user' | 'assistant';
//   content: string;
// }

export interface ChatMessage {
  message: string;
}

const TodoApi: any = {
  getTodos
};

const ollamaTools = [
  {
    type: 'function',
    function: {
      name: 'getTodos',
      description: 'Get all available flowers',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
]

const GrokTools = [
  {
    type: "function",
    function: {
      name: "getTodos",
      description: "Get all available flowers",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  }
]

export const chat = async (
  userMessage: string
): Promise<string> => {

  pushHistory({
    role: "user",
    content: userMessage
  })


  let errCount = 0


  const next = async (): Promise<string> => {

    try {
      const history = getHistory()


      const messages = [
        ...history.slice(-10)
      ]

      const response = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages,

        tools: GrokTools,

        temperature: 0,

        max_tokens: 500
      })

      const assistantMessage = response.choices[0].message

      // Normal AI answer
      if (assistantMessage.content) {

        pushHistory({
          role: "assistant",
          content: assistantMessage.content
        })

        return assistantMessage.content
      }



      // AI wants to call tools
      if (assistantMessage.tool_calls?.length) {


        for (const toolCall of assistantMessage.tool_calls) {


          const {
            name: toolName,
            arguments: toolArguments
          } = toolCall.function



          try {
            // Save assistant tool call
            pushHistory({
              role: "assistant",
              content: null,
              tool_calls: [
                toolCall
              ]
            })


            // Execute your function
            const toolResult = await TodoApi[toolName](
              JSON.parse(toolArguments)
            )



            // Return tool result to AI
            pushHistory({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult)
            })


          } catch (err) {


            errCount++


            pushHistory({
              role: "system",
              content:
                `Tool error ${toolName}: ${err instanceof Error
                  ? err.message
                  : String(err)
                }`
            })



            if (errCount < 3) {
              return next()
            }


            return `Failed after 3 attempts: ${toolName}`
          }
        }


        // Important:
        // after tool result call Groq again
        return next()
      }



      throw new Error("No response from Groq")


    } catch (err) {


      errCount++


      if (errCount < 3) {

        return next()

      }


      throw err
    }

  }


  return next()
}


/**Ollama Chat */
// export const chat = async (
//   message: string
// ): Promise<string> => {
//   pushHistory({ role: 'user', content: message })

//   const history = getHistory()

//   let errCount = 0

//   const next = async () => {
//     const response = await ollama.chat({
//       model: 'qwen2.5:7b',
//       messages: history,
//       tools: ollamaTools,
//       options: {
//         temperature: 0,
//         num_ctx: 8192
//       }
//     })

//     if (response.message.content) {
//       pushHistory({ role: 'assistant', content: response.message.content })
//       return response.message.content
//     }

//     if (response.message.tool_calls?.length) {
//       for (const toolCall of response.message.tool_calls) {
//         const { name: toolName, arguments: toolArgs } = toolCall.function

//         try {
//           pushHistory({ role: 'assistant', content: JSON.stringify(toolCall) })
//           const toolResult = await TodoApi[toolName](toolArgs)
//           pushHistory({ role: 'tool', content: JSON.stringify(toolResult) })
//           errCount = 0
//         } catch (err) {
//           errCount++
//           pushHistory({ role: 'system', content: `Error calling tool ${toolName}: ${err instanceof Error ? err.message : err}` })

//           if (errCount < 3) {
//             return `Error calling tool ${toolName}: ${err instanceof Error ? err.message : err}`
//           }
//           return next()
//         }
//       }
//       return next()
//     }

//     throw new Error(`Ollama failed to generate response`)
//   }

//   return next()
// }

/** descriptive text */
// const contentSystemTypescryptText = `
// You are an AI assistant that can call TypeScript functions.

// You have access to these functions:


// Function name:
// getTodos

// Description:
// Returns all todos.

// Type:
// async function getTodos(): Promise<Todo[]>


// Todo type:

// type Todo = {
//   id: number;
//   title: string;
//   completed: boolean;
// }


// Parameters:
// This function does not require parameters.

// Function call response format:

// When you need to call a function, return ONLY JSON:

// {
//   "type": "function",
//   "name": "function_name",
//   "params": {}
// }


// Example:

// User:
// "Show me my todos"

// Assistant response:

// {
//   "type": "function",
//   "name": "getTodos",
//   "params": {}
// }



// After a function result is returned, use it to answer the user.


// When you do not need a function:

// Return ONLY JSON:

// {
//   "type": "text",
//   "message": "your answer"
// }


// Example:

// User:
// "Hello"

// Assistant response:

// {
//   "type": "text",
//   "message": "Hello! How can I help you?"
// }


// Rules:
// - Always return valid JSON.
// - Never return markdown.
// - Never add extra text outside JSON.
// `;

/** custom by handle format json chat */

// export const chat = async (
//   message: string
// ): Promise<string> => {

//   if (getHistory().length === 0) {
//     pushHistory({ role: 'system', content: contentSystemTypescryptText })
//   }

//   pushHistory({ role: 'user', content: message })

//   const history = getHistory()

//   let errCount = 0

//   const next = async () => {
//     const response = await ollama.chat({
//       model: 'qwen2.5:7b',
//       // model: 'qwen2.5-coder:1.5b',
//       // model: 'gpt-oss',
//       messages: history,
//       options: {
//         temperature: 0,
//         num_ctx: 8192
//       },
//       format: 'json' // set format to 'json' it return json only not markdown text
//     });

//     pushHistory({ role: 'assistant', content: response.message.content })

//     const respObj = JSON.parse(response.message.content)

//     if (respObj.type === 'text') {
//       return respObj.message
//     }

//     if (respObj.type === 'function') {
//       const { name, params } = respObj

//       try {
//         const result = await TodoApi[name](params)
//         pushHistory({ role: 'tool', content: JSON.stringify(result) })
//         errCount = 0
//       } catch (error) {
//         errCount++
//         pushHistory({ role: 'system', content: `Error Calling Tool: ${name} ${error}` })
//         if (errCount > 3) {
//           throw new Error('Ollama failed to generate response')
//         }
//       }
//       return next()
//     }

//     throw new Error("invalid response type" + respObj.type)

//   }

//   return next()
// };


export const generate = async (
  prompt: string
): Promise<string> => {
  try {
    const response = await ollama.generate({
      model: 'gpt-oss',
      prompt,
    });

    return response.response;

  } catch (error) {
    console.error('Ollama error:', error);

    throw new Error(
      'Ollama failed to generate response'
    );
  }
};

export async function abortPrompt() {
  return ollama.abort();
}