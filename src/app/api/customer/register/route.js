import { db } from "@/lib/db/db";
import { customers } from "@/lib/db/schema";
import { customerRegisterSchema } from "@/lib/validators/customerSchema/customerRegisterSchema";
import bcrypt from 'bcryptjs'
import { eq } from "drizzle-orm";

export async function POST(req){

    try {
        const data = await req.formData()
        
        const SentData = {
            firstName : data.get('firstName'),
            lastName : data.get('lastName'),
            phone : data.get('phone'),
            email : data.get('email'),
            password : data.get('password'),
            role:'customer'
        }

        let validData = await customerRegisterSchema.parse(SentData);

        if(!validData){
            return Response.json({message:"Invalid Data"},{status:400})
        }

        // check already registered user if exist

        const user = await db.select().from(customers).where(eq(customers.email, validData.email));

        if(user.length>0){
            console.log(user);
            
            return Response.json({
                message:"user already registered",
                status:400
            },{status:400})
        }


        // hash password

        const hash = await bcrypt.hash(validData.password, 10);

        validData.password = hash;

        try {
            await db.insert(customers).values(validData)
        } catch (error) {
            console.log('error',error);
            return Response.json({message:"cannot store customer in db"},{status:500})
           }

           return Response.json({message:"customer registered successfully"},{status:200})

    } catch (error) {
        console.log(error);
        return Response.json({message:"something went wrong"},{status:500})
        
    }
}