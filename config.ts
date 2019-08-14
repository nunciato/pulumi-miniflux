import * as pulumi from "@pulumi/pulumi";

const cfg = new pulumi.Config();

export const config = {
    dbName: cfg.require("db_name"),
    dbUsername: cfg.require("db_username"),
    dbPassword: cfg.require("db_password"),
    adminUsername: cfg.require("admin_username"),
    adminPassword: cfg.require("admin_password"),
};
