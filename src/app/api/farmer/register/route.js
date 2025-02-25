import { db } from "@/lib/db/db";
import { customers, farmers } from "@/lib/db/schema";
import { customerRegisterSchema } from "@/lib/validators/customerSchema/customerRegisterSchema";
import { farmerRegisterSchema } from "@/lib/validators/farmerSchema/farmerRegisterSchema";
import bcrypt from 'bcryptjs'
import { eq } from "drizzle-orm";

export async function POST(req){



    //  firstName: varchar("first_name", { length: 50 }),
    //     lastName: varchar("last_name", { length: 50 }),
    //     email: varchar("email", { length: 50 }),
    //     password: varchar("password", { length: 255 }),
    //     profileImage: varchar("profile_image", { length: 255 }),
    //     phone: varchar("phone", { length: 10 }),
    //     verificationId: varchar("verification_id").unique().notNull(),
    //     pincode: varchar("pincode", { length: 6 }).notNull(),
    try {
        const data = await req.formData()
        
        const SentData = {
            firstName : data.get('firstName'),
            lastName : data.get('lastName'),
            phone : data.get('phone'),
            email : data.get('email'),
            password : data.get('password'),
            verificationId:data.get('verificationId'),
            pincode:data.get('pincode'),
            role:'farmer'
        }

        let validData = await farmerRegisterSchema.parse(SentData);

        if(!validData){
            return Response.json({message:"Invalid Data"},{status:400})
        }

        // check already registered user if exist

        const user = await db.select().from(farmers).where(eq(farmers.email, validData.email));

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
            await db.insert(farmers).values(validData)
        } catch (error) {
            console.log('error',error);
            return Response.json({message:"cannot store farmer in db"},{status:500})
           }

           return Response.json({message:"farmer registered successfully"},{status:200})

    } catch (error) {
        console.log(error);
        return Response.json({message:"something went wrong"},{status:500})
        
    }
}