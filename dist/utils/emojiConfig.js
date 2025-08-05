import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const emojiPath = path.resolve(__dirname, "../../emojiConfig.json");
export const Emojis = JSON.parse(fs.readFileSync(emojiPath, "utf8"));
