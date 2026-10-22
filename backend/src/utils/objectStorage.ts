import { createReadStream } from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';

export function isObjectStorageConfigured(): boolean {
  return Boolean(env.s3.bucket && env.s3.accessKey && env.s3.secretKey);
}

function client(): S3Client {
  return new S3Client({
    region: env.s3.region,
    endpoint: env.s3.endpoint || undefined,
    forcePathStyle: Boolean(env.s3.endpoint),
    credentials: {
      accessKeyId: env.s3.accessKey,
      secretAccessKey: env.s3.secretKey,
    },
  });
}

export async function uploadLocalFileToObjectStorage(opts: {
  localPath: string;
  key: string;
  contentType: string;
}): Promise<string> {
  await client().send(
    new PutObjectCommand({
      Bucket: env.s3.bucket,
      Key: opts.key,
      Body: createReadStream(opts.localPath),
      ContentType: opts.contentType,
    })
  );

  if (env.s3.publicUrl) return `${env.s3.publicUrl}/${opts.key}`;
  return `${env.apiPublicUrl}/uploads/${opts.key}`;
}
