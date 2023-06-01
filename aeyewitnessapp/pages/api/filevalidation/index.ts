import * as crypto from 'crypto';
import {
    AeSdk, Node, MemoryAccount, decode
} from '@aeternity/aepp-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { FileValidationResult, IFileValidation } from '@/store/models/Files';
import formidable from 'formidable';
import { Writable } from 'stream';

export const config = {
    api: {
        bodyParser: false
    }
}

const formidableConfig = {
    keepExtensions: true,
    maxFileSize: 10_000_000,
    maxFieldsSize: 10_000_000,
    maxFields: 7,
    allowEmptyFiles: false,
    multiples: false,
};

const validateFileHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const chunks: never[] = [];

    const {fields, files} = await formidablePromise(req, {
        ...formidableConfig,
        // consume this, otherwise formidable tries to save the file to disk
        fileWriteStreamHandler: () => fileConsumer(chunks),
    });
    const transaction = 'transaction' in fields && typeof fields.transaction === 'string' ? fields.transaction : 'transaction' in fields ? fields.transaction[0] : '';
    const metaData = 'metaData' in fields && typeof fields.metaData === 'string' ? fields.metaData : 'metaData' in fields ? fields.metaData[0] : '';

    const fileData = Buffer.concat(chunks);

    const data: IFileValidation = {
        file: fileData,
        transaction: transaction,
        metaData: metaData,
    }

    const result = await validateFile(data);
    if (result === undefined) {
        return res.status(400).send({
            message: 'The hashes could not be read'
        });
    }

    return res.status(200).send(result);
}

function formidablePromise(
    req: NextApiRequest,
    opts?: Parameters<typeof formidable>[0]
): Promise<{fields: formidable.Fields; files: formidable.Files}> {
    return new Promise((accept, reject) => {
        const form = formidable(opts);

        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            return accept({fields, files});
        });
    });
}

const fileConsumer = <T = unknown>(acc: T[]) => {
    const writable = new Writable({
        write: (chunk, _enc, next) => {
            acc.push(chunk);
            next();
        },
    });

    return writable;
};

const validateFile = async ({transaction, file, metaData}: IFileValidation): Promise<FileValidationResult|null> => {
    const calculatedHash = crypto.createHash('sha256').update(file).digest('hex');
    const metaDataHash = crypto.createHash('sha256').update(metaData).digest('hex');

    const originalHash = await getOriginalHash(transaction);
    let imgHash: string = '',
        mdHash: string = ''
    
    if (originalHash === '' ) {
        return null;
    }

    const payload = originalHash.split(';')
    if (payload.length !== 2) {
        return null;
    }

    imgHash = payload[0].split(':')[1]
    mdHash = payload[1].split(':')[1]


    return {
        imgOriginalHash: imgHash,
        imgCalculatedHash: calculatedHash,
        metaDataOriginalHash: mdHash,
        metaDataCalculatedHash: metaDataHash
    }
}

const getOriginalHash = async (transaction: string) => {
    const account = new MemoryAccount(process.env.AETERNITY_SECRET_KEY || '');
    const node = new Node(process.env.AETERNITY_NODE_URL || '');
    const aeSdk = new AeSdk({
        nodes: [{ name: process.env.AETERNITY_NODE_NAME || '', instance: node }]
    });

    aeSdk.addAccount(account, { select: true });

    const tx = await aeSdk.api.getTransactionByHash(transaction);
    if (tx.tx.payload) {
        // @ts-ignore
        return decode(tx.tx.payload).toString();
    }
    return '';
}

export default validateFileHandler;
