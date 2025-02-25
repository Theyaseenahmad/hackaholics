import {defineConfig} from "drizzle-kit";


export default defineConfig({
    schema: "./src/lib/db/schema.js",
    out: './drizzle',
    dialect: "postgresql",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL
}
})