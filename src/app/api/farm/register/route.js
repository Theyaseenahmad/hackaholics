import { db } from "@/lib/db/db";
import { customers, farmers, farms } from "@/lib/db/schema";
import { farmerRegisterSchema } from "@/lib/validators/farmerSchema/farmerRegisterSchema";
import { farmRegisterSchema } from "@/lib/validators/farmSchema/farmRegisterSchema";
import bcrypt from 'bcryptjs'
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken'

import {writeFile} from 'node:fs/promises'
import path from "node:path";

export async function POST(req){

    //  farmerId: integer("farmer_id").references(() => farmers.id, { onDelete: "cascade" }).notNull(),
    //     farmName: varchar("farm_name", { length: 255 }).notNull(),
    //     pincode: varchar("pincode", { length: 6 }).notNull(),
    //     area: varchar("area").notNull(),
    //     location: varchar("location").notNull(),
    //     type: varchar("type").notNull(),
    //     phone: varchar("phone", { length: 13 }).notNull(),
    //     picture: text("pictures"),
    //     description: varchar("description", { length: 400 }),

    try {
        const data = await req.formData()

        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
          }

          const token = authHeader.split(" ")[1];

    // Verify Token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);


        console.log('decoded',decoded.id);
    
        
        const SentData = {
            farmName : data.get('farmName'),
            farmerId: decoded.id,
            phone : data.get('phone'),
            verifiedId:data.get('verifiedId'),
            picture: data.get("picture"),
            pincode:data.get('pincode'),
            area:data.get('area'),
            description: data.get('description'),
            type:data.get('type'),
            location:data.get('location')
        }

        console.log("SentData",SentData);
        

        let validData = farmRegisterSchema.parse(SentData);

        if(!validData){
            return Response.json({message:"Invalid Data"},{status:400})
        }

        // check already registered farm if exist

        const existingFarm = await db.select().from(farms).where(eq(farms.verifiedId, validData.verifiedId));

        if(existingFarm.length>0){
            return Response.json({
                message:"farm already registered",
                status:400
            },{status:400})
        }

        const ImageName = `${Date.now()}.${validData.picture.name.split('.').slice(-1)}`


        try {
            const buffer = Buffer.from(await validData.picture.arrayBuffer())
            await writeFile(path.join(process.cwd(),"public/assets",ImageName),buffer)
        } catch (error) {
            return Response.json({message:"failed to store picture"},{status:500})
        }

        validData.picture = ImageName;

        try {
            await db.insert(farms).values(validData)
        } catch (error) {
            console.log('error',error);
            return Response.json({message:"cannot store farm in db"},{status:500})
           }

           return Response.json({message:"farm registered successfully"},{status:200})

    } catch (error) {
        console.log(error);
        return Response.json({message:"something went wrong"},{status:500})
        
    }
}