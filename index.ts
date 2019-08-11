import * as pulumi from "@pulumi/pulumi";

import { MinifluxDatabase } from "./database";
import { MinifluxService } from "./service";

const config = new pulumi.Config();
const dbName = config.require("db_name");
const dbUsername = config.require("db_username");
const dbPassword = config.require("db_password");
const adminUsername = config.require("admin_username");
const adminPassword = config.require("admin_password");

const database = new MinifluxDatabase(dbUsername, dbPassword, dbName);
const service = new MinifluxService(database, adminUsername, adminPassword);

export const endpoint = service.endpoint;
