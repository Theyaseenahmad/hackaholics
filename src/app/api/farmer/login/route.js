import { db } from "@/lib/db/db";
import {  farmers } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { customerLoginSchema } from "@/lib/validators/customerSchema/customerLoginSchema";
import { cookies } from "next/headers";
import { farmerLoginSchema } from "@/lib/validators/farmerSchema/farmerLoginSchema";

export async function POST(req) {
  try {
    const data = await req.formData();

    const SentData = {
      email: data.get('email'),
      password: data.get('password')
    };

    let validData = await farmerLoginSchema.parse(SentData);

    if (validData) {
      // Find user in the database
      const user = await db.select().from(farmers).where(eq(farmers.email, validData.email));

      if (user.length === 0) {
        return NextResponse.json({ message: "User does not exist" }, { status: 400 });
      }

      // Compare passwords
      const password = data.get('password');
      const isPasswordValid = await bcrypt.compare(password, user[0].password);

      if (!isPasswordValid) {
        
        return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
      }

      // Generate JWT token
      const token = await jwt.sign(
        { id: user[0].id, email: user[0].email, role:'farmer' },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token expires in 1 day
      );


      // const response = NextResponse.redirect(new URL("/home", req.url)); 

      const cookieStore = await cookies();

        cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 1,
        path: "/",

    });

    return NextResponse.json({ message: "farmer login successful" }, { status: 200 });

    }

    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
