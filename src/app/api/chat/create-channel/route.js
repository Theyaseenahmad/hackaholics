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

    // Decode the JWT token to get the user's email
    const decoded = jwt.verify(token, jwtSecret);
    const userEmail = decoded.email;

    // Get farmer's email from request body
    const { farmerEmail } = await req.json();
    if (!farmerEmail) return NextResponse.json({ error: "Farmer email required" }, { status: 400 });

    // ✅ Convert email to a Stream-compatible ID
    const formatUserId = (email) => email.toLowerCase().replace(/[^a-z0-9_-]/g, "_");

    const userId = formatUserId(userEmail);
    const farmerId = formatUserId(farmerEmail);

    // Ensure both users are in Stream
    await serverClient.upsertUser({ id: userId, name: userEmail });
    await serverClient.upsertUser({ id: farmerId, name: farmerEmail });

    // Check if a conversation already exists
    const existingChannel = await serverClient.queryChannels({
      type: "messaging",
      members: { $in: [userId, farmerId] },
    });

    if (existingChannel.length > 0) {
      return NextResponse.json({ chatId: existingChannel[0].id }, { status: 200 });
    }

    // ✅ Create a new chat channel with creator ID
    const newChannel = serverClient.channel("messaging", {
      members: [userId, farmerId],
      created_by_id: userId, // ✅ Fix: Set the creator
    });

    await newChannel.create();

    return NextResponse.json({ chatId: newChannel.id }, { status: 201 });
  } catch (error) {
    console.error("Error starting chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
