import * as pulumi from "@pulumi/pulumi"
import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";

export class MinifluxDatabase {

    public connectionString: pulumi.Output<string>;

    constructor(username: string, password: string, databaseName: string) {

        const vpc = awsx.ec2.Vpc.getDefault();
        const cluster = new awsx.ecs.Cluster("cluster", { vpc });
        let securityGroupIds = cluster.securityGroups.map(g => g.id);

        let dbSubnets = new aws.rds.SubnetGroup("dbsubnets", {
            subnetIds: vpc.publicSubnetIds,
        });

        const db = new aws.rds.Instance("db", {
            engine: "postgres",
            instanceClass: aws.rds.InstanceTypes.T2_Micro,
            allocatedStorage: 10,
            dbSubnetGroupName: dbSubnets.id,
            vpcSecurityGroupIds: securityGroupIds,
            name: databaseName,
            username: username,
            password: password,
            skipFinalSnapshot: true,
        });

        this.connectionString = pulumi.interpolate `postgres://${username}:${password}@${db.endpoint}/miniflux?sslmode=disable`
    }
}
