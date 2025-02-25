import { db } from "@/lib/db/db";
import {  farms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken"
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
                    message:"Unauthorized - not a farmer/no farms registered under you. "
                },{status:400})
            }
    
           

            try {
                const allFarm = await db.select().from(farms).where(
                    eq(farms.farmerId,decoded.id)
                );

                if(allFarm.length==0){
                    return Response.json({message:"no farms registered"},{status:400})
                }

                return Response.json({
                    farmsList : allFarm
                },{
                    status:200
                })

            } catch (error) {
                return Response.json({message:"internal server error"},{status:500})
            }
}