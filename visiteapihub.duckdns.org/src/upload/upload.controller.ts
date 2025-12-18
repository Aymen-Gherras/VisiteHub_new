import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
export class UploadController {
  constructor(private readonly configService: ConfigService) {}

  @Post('image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(process.cwd(), 'uploads');
        mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const safeExt = extname(file.originalname || '').toLowerCase() || '.jpg';
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${safeExt}`);
      },
    }),
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

    const configuredBaseUrl = this.configService.get<string>('PUBLIC_BASE_URL');
    const inferredBaseUrl = `${req.protocol}://${req.get('host')}`;
    const baseUrl = (configuredBaseUrl || inferredBaseUrl).replace(/\/$/, '');
    const imageUrl = `${baseUrl}/uploads/${file.filename}`;

    return {
      success: true,
      imageUrl,
      message: 'Image uploaded successfully',
    };
  }
}
