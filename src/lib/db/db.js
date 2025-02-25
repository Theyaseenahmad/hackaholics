import postgres from "postgres";
import {drizzle} from "drizzle-orm/postgres-js";

const queryString = process.env.DATABASE_URL;

const queryClient = postgres(queryString);

export const connection = queryClient
export const db = drizzle(connection)