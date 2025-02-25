import {z} from "zod"


//   farmerId: integer("farmer_id").references(() => farmers.id, { onDelete: "cascade" }).notNull(),
//     farmId: integer("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
//     produceName: varchar("produce_name", { length: 255 }).notNull(),
//     category: varchar("category").notNull(),
//     price: integer("price").notNull(),
//     picture: text("picture"),
//     quantity: varchar("quantity", { length: 10 }).notNull(),
//     availability: boolean("availability").default(true),

export const produceAddSchema = z.object({
    farmId:z.number({message:"farm_id should be a number"}),
    farmerId:z.number({message:"farmer_id should be a number"}),
    produceName:z.string({message:"produce name should be a string"}),
    category:z.string({message:"category must be a string"}),
    price: z.number({message:"price must be a number"}),
    picture: z.instanceof(File, { message: "Picture must be an image" }),
    quantity:z.number({message:"quantity must be number"}),
    availability: z.boolean({message:"availability should be a boolean"}),
})

