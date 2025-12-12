import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CloudinaryService } from '../src/cloudinary/cloudinary.service';

// Mock CloudinaryService
const mockCloudinaryService = {
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
  getPublicIdFromUrl: jest.fn(),
};

describe('Cloudinary Integration (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CloudinaryService)
      .useValue(mockCloudinaryService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/upload/image (POST)', () => {
    it('should upload an image successfully', async () => {
      const mockImageUrl = 'https://res.cloudinary.com/test/image/upload/v123/test.jpg';
      mockCloudinaryService.uploadImage.mockResolvedValue(mockImageUrl);

      const testImageBuffer = Buffer.from('fake-image-data');
      
      return request(app.getHttpServer())
        .post('/upload/image')
        .attach('image', testImageBuffer, 'test.jpg')
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.imageUrl).toBe(mockImageUrl);
          expect(res.body.message).toBe('Image uploaded successfully');
          expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
            expect.objectContaining({
              buffer: testImageBuffer,
              originalname: 'test.jpg',
            })
          );
        });
    });

    it('should return 400 when no image is provided', async () => {
      return request(app.getHttpServer())
        .post('/upload/image')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('No image file provided');
        });
    });

    it('should return 400 when non-image file is uploaded', async () => {
      const testFileBuffer = Buffer.from('fake-text-data');
      
      return request(app.getHttpServer())
        .post('/upload/image')
        .attach('image', testFileBuffer, 'test.txt')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('Only image files are allowed');
        });
    });

    it('should return 400 when upload fails', async () => {
      mockCloudinaryService.uploadImage.mockRejectedValue(new Error('Upload failed'));

      const testImageBuffer = Buffer.from('fake-image-data');
      
      return request(app.getHttpServer())
        .post('/upload/image')
        .attach('image', testImageBuffer, 'test.jpg')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('Failed to upload image');
        });
    });

    it('should handle large files (over 5MB)', async () => {
      // Create a buffer larger than 5MB
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
      
      return request(app.getHttpServer())
        .post('/upload/image')
        .attach('image', largeBuffer, 'large.jpg')
        .expect(413); // Payload Too Large
    });
  });
});
