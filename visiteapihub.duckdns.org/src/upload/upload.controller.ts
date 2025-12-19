import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, HttpCode, HttpStatus, Req, Optional } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly configService: ConfigService,
    @Optional() private readonly cloudinaryService?: CloudinaryService,
  ) {}

  @Post('image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', {
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB limit
    },
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.includes('image')) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  async uploadImage(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    console.log('Upload request received');
    console.log('File:', file ? {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    } : 'No file received');

    if (!file) {
      console.error('No file provided in request');
      throw new BadRequestException('No image file provided');
    }

    if (!file.mimetype.includes('image')) {
      console.error('Invalid file type:', file.mimetype);
      throw new BadRequestException('Only image files are allowed');
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Invalid upload: empty file buffer');
    }

    const uploadProvider = (this.configService.get<string>('UPLOAD_PROVIDER') || 'local').toLowerCase();
    const cloudinaryConfigured = Boolean(
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') &&
      this.configService.get<string>('CLOUDINARY_API_KEY') &&
      this.configService.get<string>('CLOUDINARY_API_SECRET'),
    );

    if (uploadProvider === 'cloudinary') {
      if (!cloudinaryConfigured) {
        throw new BadRequestException('Cloudinary upload is enabled but Cloudinary environment variables are missing');
      }
      if (!this.cloudinaryService) {
        throw new BadRequestException('Cloudinary upload is enabled but CloudinaryService is not available');
      }

      try {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        return {
          success: true,
          imageUrl,
          message: 'Image uploaded successfully',
        };
      } catch (error) {
        console.error('Cloudinary upload error details:', error);
        throw new BadRequestException(`Failed to upload image: ${error?.message || 'Unknown error'}`);
      }
    }

    // Local storage (default)
    const uploadPath = join(process.cwd(), 'uploads');
    mkdirSync(uploadPath, { recursive: true });

    const safeExt = (extname(file.originalname || '').toLowerCase() || '.jpg').replace(/[^.a-z0-9]/g, '');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${unique}${safeExt}`;
    writeFileSync(join(uploadPath, filename), file.buffer);

    const configuredBaseUrl = this.configService.get<string>('PUBLIC_BASE_URL');
    const inferredBaseUrl = `${req.protocol}://${req.get('host')}`;
    const baseUrl = (configuredBaseUrl || inferredBaseUrl).replace(/\/$/, '');
    const imageUrl = `${baseUrl}/uploads/${filename}`;

    return {
      success: true,
      imageUrl,
      message: 'Image uploaded successfully',
    };
  }
}
