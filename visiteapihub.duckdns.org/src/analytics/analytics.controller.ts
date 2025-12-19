import { Body, Controller, Get, Header, Post, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DisableCache } from '../common/decorators/disable-cache.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('visit')
  async recordVisit(@Body() body: { propertyId: string; sessionId?: string; userAgent?: string; ip?: string; wilaya?: string; daira?: string; durationSeconds?: number; }) {
    return this.analyticsService.recordVisit(body);
  }

  @Get('top-viewed')
  async topViewed(@Query('limit') limit?: string) {
    return this.analyticsService.topViewedProperties(limit ? parseInt(limit, 10) : 10);
  }

  @Get('longest-stayed')
  async longestStayed(@Query('limit') limit?: string) {
    return this.analyticsService.longestStayedProperties(limit ? parseInt(limit, 10) : 10);
  }

  @Get('top-locations')
  async topLocations(@Query('limit') limit?: string) {
    return this.analyticsService.mostVisitedLocations(limit ? parseInt(limit, 10) : 10);
  }

  @Get('summary')
  @Header('Cache-Control', 'no-store')
  @DisableCache()
  async summary() {
    return this.analyticsService.summary();
  }
}


