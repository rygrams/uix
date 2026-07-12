import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client, type ItemBucketMetadata } from 'minio'
import { Readable } from 'node:stream'
import type { Env } from '@/shared/config/env'

type UploadedObjectInfo = Awaited<ReturnType<Client['putObject']>>

export interface UploadParams {
  objectName: string
  body: Buffer | Readable
  size?: number
  metaData?: ItemBucketMetadata
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name)
  private readonly client: Client
  private readonly bucket: string

  constructor(config: ConfigService<Env, true>) {
    const region = config.get('RUSTFS_REGION', { infer: true })

    this.client = new Client({
      endPoint: config.get('RUSTFS_ENDPOINT', { infer: true }),
      port: config.get('RUSTFS_API_PORT', { infer: true }),
      useSSL: config.get('RUSTFS_USE_SSL', { infer: true }),
      accessKey: config.get('RUSTFS_ACCESS_KEY', { infer: true }),
      secretKey: config.get('RUSTFS_SECRET_KEY', { infer: true }),
      ...(region ? { region } : {}),
    })

    this.bucket = config.get('RUSTFS_BUCKET', { infer: true })
  }

  async onModuleInit(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket)
    if (!exists) {
      await this.client.makeBucket(this.bucket)
      this.logger.log(`Bucket "${this.bucket}" created`)
    }
  }

  async upload({
    objectName,
    body,
    size,
    metaData,
  }: UploadParams): Promise<UploadedObjectInfo> {
    return this.client.putObject(this.bucket, objectName, body, size, metaData)
  }

  async download(objectName: string): Promise<Readable> {
    return this.client.getObject(this.bucket, objectName)
  }

  async delete(objectName: string): Promise<void> {
    await this.client.removeObject(this.bucket, objectName)
  }

  async exists(objectName: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucket, objectName)
      return true
    } catch {
      return false
    }
  }

  async getPresignedUrl(objectName: string, expirySeconds = 3600): Promise<string> {
    return this.client.presignedGetObject(this.bucket, objectName, expirySeconds)
  }

  async getPresignedUploadUrl(
    objectName: string,
    expirySeconds = 3600,
  ): Promise<string> {
    return this.client.presignedPutObject(this.bucket, objectName, expirySeconds)
  }
}
