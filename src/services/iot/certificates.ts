import config, { AwsConfig } from '../../config.ts';

import fs from 'fs';
import http from 'http';
import os from 'os';
import { generalLogger } from '../logger/winston.ts';

const { secretMasterName, secretMasterUrl } = config.aws as AwsConfig;

export function checkMasterCertificate() {
    return new Promise((resolve, reject) => {
        try {
            const file = fs.readFileSync(`${os.tmpdir()}/${secretMasterName}.pem.crt`);
            resolve(file);
        } catch (err) {
            generalLogger.info('Certificate not found, downloading...');
            generalLogger.info(err);

            const finishedActions = [];

            const cert = fs.createWriteStream(`${os.tmpdir()}/${secretMasterName}.certificate.pem.crt`);
            const privateKey = fs.createWriteStream(`${os.tmpdir()}/${secretMasterName}.private.pem.key`);
            const amazonRoot = fs.createWriteStream(`${os.tmpdir()}/AmazonRootCA1.pem`)

            http.get(`${secretMasterUrl}/${secretMasterName}.certificate.pem.crt`,
                function (response: { pipe: (arg0: any) => void; }) {
                    response.pipe(cert);
                });

            http.get(`${secretMasterUrl}/${secretMasterName}.private.pem.key`,
                function (response: { pipe: (arg0: any) => void; }) {
                    response.pipe(privateKey);
                });

            http.get(`${secretMasterUrl}/AmazonRootCA1.pem`,
                function (response: { pipe: (arg0: any) => void; }) {
                    response.pipe(amazonRoot);
                });

            cert.on('finish', function () {
                finishedActions.push(true)

                if (finishedActions.length === 3) {
                    resolve(true);
                }
            });

            cert.on('error', function () {
                reject();
            });

            amazonRoot.on('finish', function () {
                finishedActions.push(true)

                if (finishedActions.length === 3) {
                    resolve(true);
                }
            });

            amazonRoot.on('error', function () {
                reject();
            });

            privateKey.on('finish', function () {
                finishedActions.push(true)

                if (finishedActions.length === 3) {
                    resolve(true);
                }
            });

            privateKey.on('error', function () {
                reject();
            });
        }
    });
}