import fs from "fs";
import path from "path";

function loadEvents(client: any, dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      loadEvents(client, fullPath);
    } else if (entry.name.endsWith(".ts")) {
      import(fullPath).then(eventModule => {
        const { name, once, execute } = eventModule;

        if (once) {
          client.once(name, (...args) => execute(client, ...args));
        } else {
          client.on(name, (...args) => execute(client, ...args));
        }
      });
    }
  }
}

export {loadEvents};