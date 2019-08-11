import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

import { MinifluxDatabase } from "./database";

export class MinifluxService {

    public endpoint: pulumi.Output<String>;

    constructor(database: MinifluxDatabase, adminUsername: string, adminPassword: string) {

        const networkGroup = new awsx.elasticloadbalancingv2.NetworkTargetGroup("group", { port: 8080 });
        const miniflux = networkGroup.createListener("listener", { port: 80 });

        const service = new awsx.ecs.FargateService("service", {
            desiredCount: 2,
            taskDefinitionArgs: {
                containers: {
                    service: {
                        image: "miniflux/miniflux:latest",
                        portMappings: [
                            miniflux
                        ],
                        environment: [
                            {
                                name: "DATABASE_URL",
                                value: database.connectionString,
                            },
                            {
                                name: "RUN_MIGRATIONS",
                                value: "1",
                            },
                            {
                                name: "CREATE_ADMIN",
                                value: "1",
                            },
                            {
                                name: "ADMIN_USERNAME",
                                value: adminUsername,
                            },
                            {
                                name: "ADMIN_PASSWORD",
                                value: adminPassword,
                            }
                        ]
                    }
                }
            }
        });

        this.endpoint = miniflux.endpoint.hostname;
    }
}
