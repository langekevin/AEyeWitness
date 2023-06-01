import {
    AeSdk, Node, MemoryAccount, encode, Encoding
} from '@aeternity/aepp-sdk'

const amount = 1

/**
 * Uploads the hash on the aeternity blockchain
 * @param payload The payload of the transaction
 * @returns A Promise that represents a string
 */
async function uploadHash(payload: string): Promise<string> {
    const account = new MemoryAccount(process.env.AETERNITY_SECRET_KEY || '');
    const node = new Node(process.env.AETERNITY_NODE_URL || '');
    const aeSdk = new AeSdk({
        nodes: [{ name: process.env.AETERNITY_NODE_NAME || '', instance: node }]
    });

    aeSdk.addAccount(account, { select: true });

    //@ts-ignore
    const tx = await aeSdk.spend(amount, process.env.AETERNITY_PUBLIC_KEY, { payload: encode(Buffer.from(payload), Encoding.Bytearray) });

    return tx.hash;
}

/**
 * Handles the response of the API call
 * @param req The request from the client
 * @param res The response that will be sent to the client
 * @returns Response
 */
export default async function handler(req: any, res: any) {
    const imageHash = req?.body?.imageHash;
    const metaDataHash = req?.body?.metaDataHash;
    if (typeof imageHash === 'undefined' || typeof metaDataHash === 'undefined') {
        return res.status(400).send({ message: "Error: The hash of the image or the meta data was not given" });
    }
    const payload = `img:${imageHash};meta:${metaDataHash}`
    const transaction = await uploadHash(payload);
    if (transaction) {
        return res.status(200).send({ message: "SAVED", transaction: transaction });
    }

    return res.status(400).send({ message: 'ERROR: Transaction could not be created' });
}