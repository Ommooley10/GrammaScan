import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    const { text: suggestions } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `You are a grammar expert. Analyze the given text and provide 3-5 specific, actionable suggestions to improve grammar, clarity, and style. 
      Format your response as a JSON array of strings, each containing one suggestion.
      Focus on practical improvements like:
      - Grammar corrections
      - Sentence structure improvements
      - Word choice enhancements
      - Clarity improvements
      - Punctuation fixes
      
      Example format: ["Fix subject-verb agreement in sentence 2", "Consider using active voice instead of passive", "Replace 'very good' with more specific adjective"]`,
      prompt: `Please analyze this text and provide improvement suggestions: "${text}"`,
      maxTokens: 500,
      temperature: 0.3,
    })

    try {
      const parsedSuggestions = JSON.parse(suggestions)
      return NextResponse.json({ suggestions: parsedSuggestions })
    } catch {
      // Fallback if AI doesn't return valid JSON
      const fallbackSuggestions = suggestions
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .slice(0, 5)

      return NextResponse.json({
        suggestions: fallbackSuggestions.length > 0 ? fallbackSuggestions : [suggestions],
      })
    }
  } catch (error) {
    console.error("Grammar suggestions error:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
