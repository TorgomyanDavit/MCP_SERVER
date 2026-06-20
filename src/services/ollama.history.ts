let history:any = []

type ChatMessage = {
  role: "user" | "assistant" | "system" | "tool"
  content: string | null

  tool_calls?: Array<{
    id: string
    type: "function"
    function: {
      name: string
      arguments: string
    }
  }>

  tool_call_id?: string
}


export function pushHistory(message: ChatMessage) {
  return history.push(message)
}

export function clearHistory() {
    history = []
}

export function getHistory() {
    return history
}