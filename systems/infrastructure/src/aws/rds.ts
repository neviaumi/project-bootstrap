import * as aws from '@pulumi/aws';
import type * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';
import camelcase from 'lodash.camelcase';

export async function createRDS(vpc: awsx.ec2.Vpc) {
  const rdsConfig = new pulumi.Config('rds');
  const password = new random.RandomPassword('rds-password', {
    length: 16,
  }).result;
  const dbUser = rdsConfig.require('user');
  const config = new pulumi.Config('prefix');
  const namePrefix = config.require('name');
  const subnetGroup = new aws.rds.SubnetGroup(
    `${namePrefix}-rds-subnet`,
    {
      subnetIds: vpc.privateSubnetIds,
    },
    { dependsOn: vpc },
  );
  const database = new aws.rds.Cluster(
    `${namePrefix}-rds`,
    {
      availabilityZones: ['eu-west-2a', 'eu-west-2b', 'eu-west-2c'],
      databaseName: `${camelcase(namePrefix)}`,
      dbSubnetGroupName: subnetGroup.name,
      enableHttpEndpoint: true,
      engine: 'aurora-postgresql',
      engineMode: 'serverless',
      finalSnapshotIdentifier: undefined,
      masterPassword: password,
      masterUsername: dbUser,
      scalingConfiguration: {
        minCapacity: 2,
      },
      skipFinalSnapshot: true,
    },
    {
      dependsOn: [vpc, subnetGroup],
    },
  );
  return { database, password };
}
