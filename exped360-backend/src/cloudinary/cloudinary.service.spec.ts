import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { cloudinary } from './cloudinary.config';

// Mock cloudinary
jest.mock('./cloudinary.config', () => ({
  cloudinary: {
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  let mockCloudinary: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
    mockCloudinary = cloudinary;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload an image successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('fake-image-data'),
        mimetype: 'image/jpeg',
        originalname: 'test.jpg',
      } as Express.Multer.File;

      const mockResult = {
        secure_url: 'https://res.cloudinary.com/test/image/upload/v123/test.jpg',
        public_id: 'test',
      };

      const mockUploadStream = {
        end: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        // Simulate successful upload
        setTimeout(() => callback(null, mockResult), 0);
        return mockUploadStream;
      });

      const result = await service.uploadImage(mockFile);

      expect(result).toBe(mockResult.secure_url);
      expect(mockCloudinary.uploader.upload_stream).toHaveBeenCalledWith(
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
        expect.any(Function)
      );
      expect(mockUploadStream.end).toHaveBeenCalledWith(mockFile.buffer);
    });

    it('should throw an error when upload fails', async () => {
      const mockFile = {
        buffer: Buffer.from('fake-image-data'),
        mimetype: 'image/jpeg',
        originalname: 'test.jpg',
      } as Express.Multer.File;

      const mockError = new Error('Upload failed');

      const mockUploadStream = {
        end: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        // Simulate failed upload
        setTimeout(() => callback(mockError, null), 0);
        return mockUploadStream;
      });

      await expect(service.uploadImage(mockFile)).rejects.toThrow('Upload failed');
    });
  });

  describe('deleteImage', () => {
    it('should delete an image successfully', async () => {
      const publicId = 'test-public-id';
      const mockResult = { result: 'ok' };

      mockCloudinary.uploader.destroy.mockImplementation((id, callback) => {
        setTimeout(() => callback(null, mockResult), 0);
      });

      await expect(service.deleteImage(publicId)).resolves.toBeUndefined();
      expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith(publicId, expect.any(Function));
    });

    it('should throw an error when deletion fails', async () => {
      const publicId = 'test-public-id';
      const mockError = new Error('Deletion failed');

      mockCloudinary.uploader.destroy.mockImplementation((id, callback) => {
        setTimeout(() => callback(mockError, null), 0);
      });

      await expect(service.deleteImage(publicId)).rejects.toThrow('Deletion failed');
    });
  });

  describe('getPublicIdFromUrl', () => {
    it('should extract public ID from Cloudinary URL', () => {
      const url = 'https://res.cloudinary.com/test/image/upload/v123/test-image.jpg';
      const result = service.getPublicIdFromUrl(url);
      expect(result).toBe('test-image');
    });

    it('should return empty string for invalid URL', () => {
      const url = 'https://example.com/image.jpg';
      const result = service.getPublicIdFromUrl(url);
      expect(result).toBe('');
    });

    it('should handle URL with folder structure', () => {
      const url = 'https://res.cloudinary.com/test/image/upload/v123/folder/test-image.jpg';
      const result = service.getPublicIdFromUrl(url);
      expect(result).toBe('folder/test-image');
    });
  });
});
