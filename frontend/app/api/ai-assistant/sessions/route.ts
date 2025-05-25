import { type NextRequest, NextResponse } from "next/server"
import type { ChatSession } from "@/lib/types"

const sessions: ChatSession[] = []

export async function GET() {
  return NextResponse.json(sessions)
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: title || "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    sessions.unshift(newSession)

    return NextResponse.json({ sessionId: newSession.id })
  } catch {
    // removed unused error param
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
