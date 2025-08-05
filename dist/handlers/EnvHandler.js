import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
const token = process.env.DISCORD_TOKEN;
const client_id = process.env.CLIENT_ID;
if (!token || !client_id) {
    console.error("❌ Env file is not configured properly or missing variables.");
    process.exit(1);
}
export { token, client_id };
