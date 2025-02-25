import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // ✅ Import Next.js cookies
import jwt from "jsonwebtoken";
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const jwtSecret = process.env.JWT_SECRET;

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export async function POST(req) {
  try {
    const cookieStore = cookies(); // ✅ Get cookies from Next.js
    const token = cookieStore.get("auth_token")?.value; // ✅ Get token

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode JWT to get user email
    const decoded = jwt.verify(token, jwtSecret);
    const userEmail = decoded.email;

    // Get message details from request body
    const { chatId, text } = await req.json();
    if (!chatId || !text) {
      return NextResponse.json({ error: "Chat ID and text required" }, { status: 400 });
    }

    // Fetch the chat channel
    const channel = serverClient.channel("messaging", chatId);
    await channel.watch();

    // Send the message
    const message = await channel.sendMessage({
      text,
      user_id: userEmail,
    });

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
