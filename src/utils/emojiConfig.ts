import fs from "fs";
import path from "path";

const emojiPath = path.resolve(__dirname, "../../emojiConfig.json");

export const Emojis: Record<string, string> = JSON.parse(
  fs.readFileSync(emojiPath, "utf8")
);