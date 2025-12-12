import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Get,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PropertyAssignmentService } from '../services/property-assignment.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { IsUUID, IsOptional } from 'class-validator';

class AssignToAgenceDto {
  @IsUUID()
  agenceId: string;
}

class AssignToPromoteurDto {
  @IsUUID()
  promoteurId: string;

  @IsUUID()
  @IsOptional()
  projectId?: string;
}

@Controller('admin/properties')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminPropertyAssignmentController {
  constructor(
    private readonly propertyAssignmentService: PropertyAssignmentService,
  ) {}

  @Post(':id/assign-to-agence')
  async assignToAgence(
    @Param('id', ParseUUIDPipe) propertyId: string,
    @Body() assignDto: AssignToAgenceDto,
  ) {
    return {
      success: true,
      data: await this.propertyAssignmentService.assignPropertyToAgence(
        propertyId,
        assignDto.agenceId,
      ),
      message: 'Property assigned to agence successfully',
    };
  }

  @Post(':id/assign-to-promoteur')
  async assignToPromoteur(
    @Param('id', ParseUUIDPipe) propertyId: string,
    @Body() assignDto: AssignToPromoteurDto,
  ) {
    return {
      success: true,
      data: await this.propertyAssignmentService.assignPropertyToPromoteur(
        propertyId,
        assignDto.promoteurId,
        assignDto.projectId,
      ),
      message: 'Property assigned to promoteur successfully',
    };
  }

  @Post(':id/remove-assignments')
  @HttpCode(HttpStatus.OK)
  async removeAssignments(@Param('id', ParseUUIDPipe) propertyId: string) {
    return {
      success: true,
      data: await this.propertyAssignmentService.removePropertyAssignments(propertyId),
      message: 'Property assignments removed successfully',
    };
  }

  @Post('bulk-auto-assign')
  async bulkAutoAssign() {
    return {
      success: true,
      data: await this.propertyAssignmentService.bulkAutoAssignProperties(),
      message: 'Bulk auto-assignment completed',
    };
  }

  @Get('assignment-stats')
  async getAssignmentStats() {
    return {
      success: true,
      data: await this.propertyAssignmentService.getAssignmentStats(),
    };
  }

  @Get('unassigned')
  async getUnassignedProperties(@Query('limit') limit?: string) {
    return {
      success: true,
      data: await this.propertyAssignmentService.getUnassignedProperties(
        limit ? parseInt(limit) : 50
      ),
    };
  }
}
