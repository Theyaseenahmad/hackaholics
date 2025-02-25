import { db } from "@/lib/db/db";
import {  farms, produce } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
export async function POST(req){


            const {farmId} = await req.json();
            try {
                const allProduce = await db.select().from(produce).where(
                    eq(produce.farmId,Number(farmId))
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