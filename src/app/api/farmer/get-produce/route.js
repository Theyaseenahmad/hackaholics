import { db } from "@/lib/db/db";
import {  farms, produce } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
export async function GET(req){

     const authHeader = req.headers.get("Authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
              }
              const token = authHeader.split(" ")[1];
    
        // Verify Token
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);

            console.log('decoded',decoded);  // farmer id

            if(decoded.role != "farmer"){
                return Response.json({
                    message:"Unauthorized - not a farmer/no produce registered under you. "
                },{status:400})
            }
    
           

            try {
                const allProduce = await db.select().from(produce).where(
                    eq(produce.farmerId,decoded.id)
                );

                if(allProduce.length==0){
                    return Response.json({message:"no produce"},{status:400})
                }

                return Response.json({
                    produceList : allProduce
                },{
                    status:200
                })

            } catch (error) {
                console.log("error",error);
                
                return Response.json({message:"internal server error"},{status:500})
            }
}