import "dotenv/config"

let token = process.env.DISCORD_TOKEN
let client_id = process.env.CLIENT_ID

if(!token || !client_id) {
  console.log("Env file is not configured properly");
  process.exit(0);
}

export { token, client_id }
