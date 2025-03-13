import express, { Application } from 'express';
import api from './src/api/index.ts';
import config from './src/config.ts';
import cors from 'cors';
import connectToDatabase from './src/services/mongo/mongo.ts';
import passportConfig from './src/services/auth/auth.ts';
import { generalLogger, requestLogger } from './src/services/logger/winston.ts';
import multer from "multer"
import { checkMasterCertificate } from './src/services/iot/certificates.ts';
import IotService from './src/services/iot/index.ts';

const app: Application = express();
const port: number = config.port || 3000;

app.use(requestLogger);

app.use(passportConfig.initialize());

app.use(express.json());
app.use(cors({
    origin: [config.clientUrl],
}));

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5242880 }, // 5MB file size limit
});

app.use('/', api);

setImmediate(async () => {
    try {
        await connectToDatabase();

        app.listen(port, async () => {
            generalLogger.info('SERVER: ', { message: `Server started on port ${port}` });

            await checkMasterCertificate();

            IotService.getInstance();
        });
    } catch (error) {
        generalLogger.error('SERVER: ', { message: error.message });
    }
});
