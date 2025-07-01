import dotenv from 'dotenv';
dotenv.config();
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    }
})

const BUCKET = process.env.AWS_BUCKET_NAME;


console.log("ENV BUCKET NAME:", process.env.AWS_BUCKET_NAME); // Should NOT be undefined

console.log("bucket name",BUCKET)


export const uploadToS3 = async (fileName, fileBuffer, mimeType) =>{
    const key = `products/${randomUUID()}-${fileName}`;

    const params = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
       
    })
    await s3.send(params);

    return {
        Location: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    }
}