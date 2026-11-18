import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { log, info, err, warn } from "../config/logger.config.js";

const plugins = new Map();
const loader = async () => {
  try {
    const fullPath = path.resolve("plugins");
    const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".js"));

    for (const file of files) {
      const urlFiles = path.join(fullPath, file);
      const plugin = await import(pathToFileURL(urlFiles).href);
      const module = plugin.default,
        cmd = plugin.default.command;
      if (module && cmd) {
        plugins.set(cmd, module);
        log(info(`Success Loaded ${file}`));
      } else {
        log(warn(`Failed Loaded ${file}`));
      }
    }
  } catch (e) {
    log(err(e));
  }
};

export { loader, plugins };
