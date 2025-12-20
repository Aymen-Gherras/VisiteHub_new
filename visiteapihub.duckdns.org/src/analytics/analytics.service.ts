import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitEvent } from './entities/visit-event.entity';
import { ContactClickEvent, ContactClickType } from './entities/contact-click-event.entity';
import { Property } from '../properties/entities/property.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VisitEvent)
    private readonly visitRepo: Repository<VisitEvent>,
    @InjectRepository(ContactClickEvent)
    private readonly contactClickRepo: Repository<ContactClickEvent>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  async recordVisit(params: {
    propertyId: string;
    sessionId?: string;
    userAgent?: string;
    ip?: string;
    wilaya?: string;
    daira?: string;
    durationSeconds?: number;
  }): Promise<{ success: true }>{
    const property = await this.propertyRepo.findOne({ where: { id: params.propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    const event = this.visitRepo.create({
      property,
      sessionId: params.sessionId,
      userAgent: params.userAgent,
      ip: params.ip,
      wilaya: params.wilaya ?? property.wilaya,
      daira: params.daira ?? property.daira,
      durationSeconds: params.durationSeconds,
    });
    await this.visitRepo.save(event);
    return { success: true };
  }

  async topViewedProperties(limit = 10): Promise<Array<{ propertyId: string; title: string; views: number }>> {
    const rows = await this.visitRepo
      .createQueryBuilder('v')
      .leftJoin('v.property', 'p')
      .select('p.id', 'propertyId')
      .addSelect('p.title', 'title')
      .addSelect('COUNT(v.id)', 'views')
      .groupBy('p.id')
      .addGroupBy('p.title')
      .orderBy('views', 'DESC')
      .limit(limit)
      .getRawMany();

    const base = rows.map(r => ({ propertyId: r.propertyId, title: r.title, views: Number(r.views) }));
    const propertyIds = base.map(r => r.propertyId).filter(Boolean);
    if (propertyIds.length === 0) {
      return base;
    }

    const clickRows = await this.contactClickRepo
      .createQueryBuilder('c')
      .leftJoin('c.property', 'p')
      .select('p.id', 'propertyId')
      .addSelect('c.type', 'type')
      .addSelect('COUNT(c.id)', 'clicks')
      .where('p.id IN (:...ids)', { ids: propertyIds })
      .groupBy('p.id')
      .addGroupBy('c.type')
      .getRawMany();

    const clicksByProperty = new Map<string, { phoneClicks: number; whatsappClicks: number }>();
    for (const row of clickRows) {
      const propertyId = row.propertyId as string;
      const type = row.type as ContactClickType;
      const clicks = Number(row.clicks) || 0;
      const prev = clicksByProperty.get(propertyId) ?? { phoneClicks: 0, whatsappClicks: 0 };
      if (type === 'PHONE') prev.phoneClicks = clicks;
      if (type === 'WHATSAPP') prev.whatsappClicks = clicks;
      clicksByProperty.set(propertyId, prev);
    }

    return base.map((r) => {
      const extra = clicksByProperty.get(r.propertyId) ?? { phoneClicks: 0, whatsappClicks: 0 };
      return { ...r, ...extra };
    }) as any;
  }

  async recordContactClick(params: { propertyId: string; type: ContactClickType }): Promise<{ success: true }> {
    const property = await this.propertyRepo.findOne({ where: { id: params.propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    const event = this.contactClickRepo.create({
      property,
      type: params.type,
    });
    await this.contactClickRepo.save(event);
    return { success: true };
  }

  async longestStayedProperties(limit = 10): Promise<Array<{ propertyId: string; title: string; avgDurationSeconds: number }>> {
    const rows = await this.visitRepo
      .createQueryBuilder('v')
      .leftJoin('v.property', 'p')
      .select('p.id', 'propertyId')
      .addSelect('p.title', 'title')
      .addSelect('AVG(COALESCE(v.durationSeconds, 0))', 'avgDurationSeconds')
      .groupBy('p.id')
      .addGroupBy('p.title')
      .orderBy('AVG(COALESCE(v.durationSeconds, 0))', 'DESC')
      .limit(limit)
      .getRawMany();
    return rows.map(r => ({ propertyId: r.propertyId, title: r.title, avgDurationSeconds: Math.round(Number(r.avgDurationSeconds) || 0) }));
  }

  async mostVisitedLocations(limit = 10): Promise<Array<{ wilaya: string; daira: string | null; visits: number }>> {
    const rows = await this.visitRepo
      .createQueryBuilder('v')
      .select('COALESCE(v.wilaya, \'Unknown\')', 'wilaya')
      .addSelect('v.daira', 'daira')
      .addSelect('COUNT(v.id)', 'visits')
      .groupBy('v.wilaya')
      .addGroupBy('v.daira')
      .orderBy('visits', 'DESC')
      .limit(limit)
      .getRawMany();
    return rows.map(r => ({ wilaya: r.wilaya, daira: r.daira, visits: Number(r.visits) }));
  }

  async summary(): Promise<{ totalVisits: number; last7DaysVisits: number }> {
    const totalVisits = await this.visitRepo.count();
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysVisits = await this.visitRepo
      .createQueryBuilder('v')
      .where('v.createdAt >= :since', { since: last7Days })
      .getCount();

    return { totalVisits, last7DaysVisits };
  }
}


