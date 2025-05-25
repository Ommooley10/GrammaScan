import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, context } = await request.json()

    // Grammar-focused system prompt optimized for Gemini
    const systemPrompt = `You are a helpful AI assistant specializing in grammar, writing, and language. 
    You help users improve their writing by:
    - Explaining grammar rules clearly with examples
    - Providing writing tips and suggestions
    - Answering language-related questions
    - Offering constructive feedback on text
    - Suggesting better word choices and sentence structures
    - Identifying common grammar mistakes and how to fix them
    
    Be friendly, encouraging, and educational in your responses. 
    Always provide clear explanations and practical examples when possible.
    When analyzing text, be specific about what needs improvement and why.
    Use a conversational tone while maintaining expertise.`

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 1000,
      temperature: 0.7,
    })

    // Create response message
    const assistantMessage = {
      id: Date.now().toString(),
      role: "assistant" as const,
      content: text,
      timestamp: new Date(),
      type: "text" as const,
    }

    return NextResponse.json(assistantMessage)
  } catch (error) {
    console.error("AI Assistant error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
