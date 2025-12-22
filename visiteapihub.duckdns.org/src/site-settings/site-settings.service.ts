import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomepageSettings } from './entities/homepage-settings.entity';
import { HomepageCarouselImage } from './entities/homepage-carousel-image.entity';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(HomepageSettings) private readonly settingsRepo: Repository<HomepageSettings>,
    @InjectRepository(HomepageCarouselImage) private readonly imagesRepo: Repository<HomepageCarouselImage>,
  ) {}

  async getOrCreateSettings(): Promise<HomepageSettings> {
    let s = await this.settingsRepo.findOne({ where: {} });
    if (!s) {
      s = this.settingsRepo.create({ maxSlides: 3 });
      s = await this.settingsRepo.save(s);
    }
    return s;
  }

  async getSettings(): Promise<HomepageSettings> {
    return this.getOrCreateSettings();
  }

  async updateSettings(maxSlides?: number, maxFeatured?: number): Promise<HomepageSettings> {
    if (maxSlides !== undefined && (typeof maxSlides !== 'number' || maxSlides < 1 || maxSlides > 6)) {
      throw new BadRequestException('maxSlides must be between 1 and 6');
    }
    if (maxFeatured !== undefined && (typeof maxFeatured !== 'number' || maxFeatured < 1 || maxFeatured > 24)) {
      throw new BadRequestException('maxFeatured must be between 1 and 24');
    }
    const s = await this.getOrCreateSettings();
    if (maxSlides !== undefined) s.maxSlides = maxSlides;
    if (maxFeatured !== undefined) s.maxFeatured = maxFeatured;
    return this.settingsRepo.save(s);
  }

  async listImages(includeInactive = true): Promise<HomepageCarouselImage[]> {
    const where = includeInactive ? {} : { isActive: true };
    return this.imagesRepo.find({ where, order: { order: 'ASC', createdAt: 'DESC' } });
  }

  async listPublic(): Promise<Array<Pick<HomepageCarouselImage, 'imageUrl' | 'altText' | 'linkUrl' | 'mediaType'>>> {
    try {
      const settings = await this.getOrCreateSettings();
      const images = await this.imagesRepo.find({ where: { isActive: true }, order: { order: 'ASC', createdAt: 'DESC' }, take: settings.maxSlides });
      return images.map(({ imageUrl, altText, linkUrl, mediaType }) => ({ imageUrl, altText, linkUrl, mediaType }));
    } catch (error) {
      console.error('Error in listPublic:', error);
      return [];
    }
  }

  async createImage(data: Partial<HomepageCarouselImage>): Promise<HomepageCarouselImage> {
    const activeCount = await this.imagesRepo.count({ where: { isActive: true } });
    const settings = await this.getOrCreateSettings();
    if (data.isActive && activeCount >= settings.maxSlides) {
      throw new BadRequestException('Maximum active slides reached');
    }
    const nextOrder = (await this.imagesRepo.count()) + 1;
    const entity = this.imagesRepo.create({
      imageUrl: data.imageUrl!,
      altText: data.altText,
      linkUrl: data.linkUrl,
      mediaType: data.mediaType === 'video' ? 'video' : 'image',
      isActive: !!data.isActive,
      order: nextOrder,
    });
    return this.imagesRepo.save(entity);
  }

  async updateImage(id: string, patch: Partial<HomepageCarouselImage>): Promise<HomepageCarouselImage> {
    const img = await this.imagesRepo.findOne({ where: { id } });
    if (!img) throw new BadRequestException('Image not found');

    if (patch.isActive === true && !img.isActive) {
      const settings = await this.getOrCreateSettings();
      const activeCount = await this.imagesRepo.count({ where: { isActive: true } });
      if (activeCount >= settings.maxSlides) {
        throw new BadRequestException('Maximum active slides reached');
      }
    }

    Object.assign(img, patch);
    return this.imagesRepo.save(img);
  }

  async deleteImage(id: string): Promise<void> {
    await this.imagesRepo.delete(id);
  }

  async reorder(items: Array<{ id: string; order: number }>): Promise<void> {
    for (const { id, order } of items) {
      await this.imagesRepo.update({ id }, { order });
    }
  }

  async upload(file: Express.Multer.File): Promise<{ imageUrl: string; mediaType: 'image' | 'video' }> {
    if (!file) {
      throw new BadRequestException('Missing file');
    }

    const isVideo = typeof file.mimetype === 'string' && file.mimetype.startsWith('video/');

    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const originalExt = extname(file.originalname || '').toLowerCase();
    const fallbackExt = isVideo ? '.mp4' : '.jpg';
    const ext = originalExt || fallbackExt;
    const filename = `${Date.now()}-${randomUUID()}${ext}`;
    const filePath = join(uploadsDir, filename);

    await writeFile(filePath, file.buffer);

    // Store relative path; served via static /uploads
    const imageUrl = `/uploads/${filename}`;
    return { imageUrl, mediaType: isVideo ? 'video' : 'image' };
  }
}


