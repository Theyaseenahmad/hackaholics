import {z} from "zod"


export const farmerLoginSchema = z.object({
    email: z.string({message:'email should be a string'}).email(),
    password: z.string({message:'password should be a string'}).min(6,{message:'password should be at least 6 characters'})
})

