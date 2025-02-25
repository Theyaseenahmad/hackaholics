import {z} from "zod"


export const customerRegisterSchema = z.object({
    firstName: z.string({message:'firstName should be a string'}),
    lastName: z.string({message:'lastName should be a string'}),
    email: z.string({message:'email should be a string'}).email(),
    password: z.string({message:'password should be a string'}).min(6,{message:'password should be at least 6 characters'}),
    phone: z.string({message:'phone number should be a string'}).length(10,{message:'phone number must be 10 digits'}),
    role: z.string({message:'role should be a string'})
})

