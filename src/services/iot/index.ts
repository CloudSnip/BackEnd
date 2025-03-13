import config, { AwsConfig } from '../../config.ts';
import { generalLogger } from '../logger/winston.ts';
import { DataLog } from '../../models/datalogs';
import awsIot from 'aws-iot-device-sdk';
import AWS from 'aws-sdk';
import os from 'os';

const { secretMasterName, host } = config.aws as AwsConfig;

AWS.config.update({ region: 'eu-central-1' });

const iot = new AWS.Iot();

class IotService {
    private static instance: IotService;
    private device: awsIot.device | null = null;

    private constructor() {
        this.initDevice();
    }

    public static getInstance(): IotService {
        if (!IotService.instance) {
            IotService.instance = new IotService();
        }
        return IotService.instance;
    }

    private initDevice() {
        this.device = new awsIot.device({
            keyPath: `${os.tmpdir()}/${secretMasterName}.private.pem.key`,
            certPath: `${os.tmpdir()}/${secretMasterName}.certificate.pem.crt`,
            caPath: `${os.tmpdir()}/AmazonRootCA1.pem`,
            host: host
        });

        this.device.on('connect', () => {
            generalLogger.info('system connected to aws iot...');
            if (!this.device) {
                generalLogger.error('device not found');
                return;
            }
            this.device.subscribe('machines');
            generalLogger.info('mqtt parser ready...');
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.device.on('error', (e: any) => {
            generalLogger.info({ e });
        });

        this.device.on('message', (topic: string, payload: { toString: () => string }) => {
            generalLogger.info('message received');
            this.parser(payload.toString());
        });
    }

    public createThing(thing: Thing) {
        const params = {
            thingName: thing.iotCode,
            attributePayload: {
                attributes: {
                    clientId: thing.clientId.toString(),
                    laiType: thing.type,
                    billingGroupName: 'lai'
                }
            }
        };

        return new Promise((resolve, reject) => {
            iot.createThing(params, (err: any, data: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    public async deleteThing(thing: Thing) {
        generalLogger.warn('init deleting a thing from AWS');

        if (!thing.iotCode) {
            throw new Error('unable to delete from AWS without iotCode');
        }

        await this.detachPolicy(thing);
        await this.detachThingPrincipal(thing);
        await this.updateCertificate(thing);
        await this.deleteCertificate(thing);
        await this.deleteThing(thing);
    }

    private detachPolicy(thing: Thing) {
        const params = {
            policyName: 'machine',
            target: thing.certificateArn
        };

        return new Promise((resolve, reject) => {
            iot.detachPolicy(params, (err: any, data: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private detachThingPrincipal(thing: Thing) {
        const params = {
            thingName: thing.iotCode,
            principal: thing.certificateArn
        };

        return new Promise((resolve, reject) => {
            iot.detachThingPrincipal(params, (err: any, data: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private updateCertificate(thing: Thing) {
        const certificateId = thing.certificateArn.split('/')[1];
        const params = {
            certificateId: certificateId,
            newStatus: 'INACTIVE'
        };

        return new Promise((resolve, reject) => {
            iot.updateCertificate(params, (err: any, data: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private deleteCertificate(thing: Thing) {
        const certificateId = thing.certificateArn.split('/')[1];
        const params = {
            certificateId: certificateId,
        };

        return new Promise((resolve, reject) => {
            iot.deleteCertificate(params, (err: any, data: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private deleteThing(thing: Thing) {
        const params = {
            thingName: thing.iotCode,
        };

        return new Promise((resolve, reject) => {
            iot.deleteThing(params, (err: any, data: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private parser(message: string) {
        let objectMessage;
        try {
            objectMessage = JSON.parse(message);
        } catch (_error) {
            generalLogger.error(`error parsing message: ${message}`);
        }

        DataLog.parseMessage(objectMessage);
    }
}

export default IotService.getInstance();
