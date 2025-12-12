import { Injectable } from '@nestjs/common';
import { cloudinary } from './cloudinary.config';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log('CloudinaryService: Starting upload...');
    console.log('CloudinaryService: File buffer size:', file.buffer?.length || 'No buffer');
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'exped360-properties',
          transformation: [
            { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
            { fetch_format: 'auto' }
          ],
          eager: [
            { width: 600, height: 400, crop: 'fill', quality: 'auto' },
            { width: 300, height: 200, crop: 'fill', quality: 'auto' }
          ],
          eager_async: true,
          eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL,
        },
        (error, result) => {
          if (error) {
            console.error('CloudinaryService: Upload error:', error);
            reject(error);
          } else if (result) {
            console.log('CloudinaryService: Upload successful:', result.secure_url);
            resolve(result.secure_url);
          } else {
            console.error('CloudinaryService: No result returned');
            reject(new Error('Upload failed: No result returned from Cloudinary'));
          }
        }
      );

      console.log('CloudinaryService: Ending upload stream...');
      uploadStream.end(file.buffer);
    });
  }

  async uploadImageWithResult(file: Express.Multer.File, folder: string = 'exped360-properties'): Promise<CloudinaryUploadResult> {
    console.log('CloudinaryService: Starting upload with result...');
    console.log('CloudinaryService: File buffer size:', file.buffer?.length || 'No buffer');
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
            { fetch_format: 'auto' }
          ],
          eager: [
            { width: 600, height: 400, crop: 'fill', quality: 'auto' },
            { width: 300, height: 200, crop: 'fill', quality: 'auto' }
          ],
          eager_async: true,
          eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL,
        },
        (error, result) => {
          if (error) {
            console.error('CloudinaryService: Upload error:', error);
            reject(error);
          } else if (result) {
            console.log('CloudinaryService: Upload successful:', result.secure_url);
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
            });
          } else {
            console.error('CloudinaryService: No result returned');
            reject(new Error('Upload failed: No result returned from Cloudinary'));
          }
        }
      );

      console.log('CloudinaryService: Ending upload stream...');
      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async uploadVideo(file: Express.Multer.File, maxDuration: number = 60): Promise<string> {
    console.log('CloudinaryService: Starting video upload...');
    console.log('CloudinaryService: File buffer size:', file.buffer?.length || 'No buffer');
    console.log('CloudinaryService: File mimetype:', file.mimetype);
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'exped360-carousel-videos',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit', quality: 'auto' },
            { fetch_format: 'auto' }
          ],
          eager: [
            { width: 1280, height: 720, crop: 'limit', quality: 'auto' },
            { width: 640, height: 360, crop: 'limit', quality: 'auto' }
          ],
          eager_async: true,
          max_video_duration: maxDuration, // Max duration in seconds (default 60s)
          chunk_size: 6000000, // 6MB chunks for better upload handling
        },
        (error, result) => {
          if (error) {
            console.error('CloudinaryService: Video upload error:', error);
            reject(error);
          } else if (result) {
            console.log('CloudinaryService: Video upload successful:', result.secure_url);
            resolve(result.secure_url);
          } else {
            console.error('CloudinaryService: No result returned');
            reject(new Error('Upload failed: No result returned from Cloudinary'));
          }
        }
      );

      console.log('CloudinaryService: Ending upload stream...');
      uploadStream.end(file.buffer);
    });
  }

  getPublicIdFromUrl(url: string): string {
    // Extract public ID from Cloudinary URL
    const match = url.match(/\/v\d+\/([^\/]+)\./);
    return match ? match[1] : '';
  }
}
