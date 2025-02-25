import {z} from "zod"

export const farmRegisterSchema = z.object({
    farmName: z.string({message:"farmname should be a string"}),
    farmerId:z.number({message:"farmer_id should be a number"}),
    verifiedId: z.string({message:"verified Id must be a string"}).length(12,{message:"verified id should be 12 characters"}),
    area:z.string({message:"area should be a string"}),
    location:z.string({message:"location must be a string"}),
    type: z.string({message:"type must be a string"}),
    picture: z.instanceof(File, { message: "Picture must be an image" }),
    description:z.string({message:"description must be a string"}),
    pincode:z.string({message:'pincode must be a string'}).length(6,{message:'pincode must be 6 characters long'}),
    phone: z.string({message:'phone number should be a string'}).length(10,{message:'phone number must be 10 digits'}),
})

