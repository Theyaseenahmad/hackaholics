import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import jwt from "jsonwebtoken";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const jwtSecret = process.env.JWT_SECRET;

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify user token
    const decoded = jwt.verify(token, jwtSecret);
    const userEmail = decoded.email;

    // Extract chatId from request
    const { chatId } = await req.json();
    if (!chatId) return NextResponse.json({ error: "Chat ID required" }, { status: 400 });

    // Get the channel
    const channel = serverClient.channel("messaging", chatId);
    await channel.watch(); // Ensure it's initialized

    // Retrieve messages
    const messages = await channel.state.messages;

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
