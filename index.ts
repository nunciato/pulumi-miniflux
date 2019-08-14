import { config } from "./config";

import { MinifluxDatabase } from "./database";
import { MinifluxService } from "./service";

const database = new MinifluxDatabase(config.dbUsername, config.dbPassword, config.dbName);
const service = new MinifluxService(database, config.adminUsername, config.adminPassword);

export const endpoint = service.endpoint;
