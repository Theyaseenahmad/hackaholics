import { db } from "@/lib/db/db";
import { customers, farmers, farms, produce } from "@/lib/db/schema";
import { produceAddSchema } from "@/lib/validators/produceSchema/produceAddSchema";
import jwt from 'jsonwebtoken'

import {writeFile} from 'node:fs/promises'
import path from "node:path";

export async function POST(req){

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
            farmerId: decoded.id,
            farmId : Number(data.get('farmId')),
            produceName:data.get('produceName'),
            picture: data.get("picture"),
            price:Number(data.get('price')),
            quantity:Number(data.get('quantity')),
            availability: Boolean(data.get('availability')),
            category:data.get('category')
        }

        console.log("SentData",SentData);
        

        let validData = produceAddSchema.parse(SentData);

        if(!validData){
            return Response.json({message:"Invalid Data"},{status:400})
        }


        const ImageName = `${Date.now()}.${validData.picture.name.split('.').slice(-1)}`


        try {
            const buffer = Buffer.from(await validData.picture.arrayBuffer())
            await writeFile(path.join(process.cwd(),"public/assets",ImageName),buffer)
        } catch (error) {
            return Response.json({message:"failed to store produce picture"},{status:500})
        }

        validData.picture = ImageName;

        try {
            await db.insert(produce).values(validData)
        } catch (error) {
            console.log('error',error);
            return Response.json({message:"cannot store produce in db"},{status:500})
           }

           return Response.json({message:"produce added successfully"},{status:200})

    } catch (error) {
        console.log(error);
        return Response.json({message:"something went wrong"},{status:500})
        
    }
}