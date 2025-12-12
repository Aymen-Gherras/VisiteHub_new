import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.includes('image')) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
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

    try {
      console.log('Attempting to upload to Cloudinary...');
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      console.log('Upload successful, URL:', imageUrl);
      return {
        success: true,
        imageUrl,
        message: 'Image uploaded successfully',
      };
    } catch (error) {
      console.error('Upload error details:', error);
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }
}
