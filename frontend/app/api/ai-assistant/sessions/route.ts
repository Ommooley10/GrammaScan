import { type NextRequest, NextResponse } from "next/server"

// In a real app, you'd use a database. For now, we'll use in-memory storage
const sessions: any[] = []

export async function GET() {
  return NextResponse.json(sessions)
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()

    const newSession = {
      id: Date.now().toString(),
      title: title || "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    sessions.unshift(newSession)

    return NextResponse.json({ sessionId: newSession.id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
