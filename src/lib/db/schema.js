import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 50 }).notNull(),
    password: varchar("password", { length: 255 }),
    profileImage: varchar("profile_image", { length: 255 }),
    phone: varchar("phone", { length: 10 }),
    pincode: varchar("pincode", { length: 6 }),
    address: varchar("address", { length: 500 }),
    socketId: varchar("socket_id", { length: 255 }),
    role: varchar("role", { length: 50 }).default("customer"),
    
});


export const farmers = pgTable("farmers", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
    email: varchar("email", { length: 50 }),
    password: varchar("password", { length: 255 }),
    profileImage: varchar("profile_image", { length: 255 }),
    phone: varchar("phone", { length: 10 }),
    verificationId: varchar("verification_id").unique().notNull(),
    pincode: varchar("pincode", { length: 6 }).notNull(),
    role:varchar('role').default('farmer'),
});


export const farms = pgTable("farms", {
    id: serial("id").primaryKey(),
    farmerId: integer("farmer_id").references(() => farmers.id, { onDelete: "cascade" }).notNull(),
    farmName: varchar("farm_name", { length: 255 }).notNull(),
    pincode: varchar("pincode", { length: 6 }).notNull(),
    area: varchar("area").notNull(),
    location: varchar("location").notNull(),
    type: varchar("type").notNull(),
    phone: varchar("phone", { length: 13 }).notNull(),
    verifiedId: varchar('verifiedId',{length:12}).notNull().unique(),
    picture: text("picture"),
    description: varchar("description", { length: 400 }),
    registerDate: timestamp("register_date").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`)
});


export const produce = pgTable("produce", {
    id: serial("id").primaryKey(),
    farmerId: integer("farmer_id").references(() => farmers.id, { onDelete: "cascade" }).notNull(),
    farmId: integer("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
    produceName: varchar("produce_name", { length: 255 }).notNull(),
    category: varchar("category").notNull(),
    price: integer("price").notNull(),
    picture: text("picture"),
    quantity: varchar("quantity", { length: 10 }).notNull(),
    availability: boolean("availability").default(true),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`)
});