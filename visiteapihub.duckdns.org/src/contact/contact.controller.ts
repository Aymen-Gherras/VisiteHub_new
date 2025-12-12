import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, UseInterceptors, UploadedFiles, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, RawBodyRequest, UsePipes } from '@nestjs/common';
import { DemandeService } from './contact.service';
import { CreateDemandeDto } from './dto/create-contact-request.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';
import { DemandeStatus } from './entities/contact-request.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

@ApiTags('demandes')
@Controller('demandes')
export class DemandeController {
  constructor(private readonly demandeService: DemandeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new demande' })
  @ApiResponse({ status: 201, description: 'Demande successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createDemandeDto: CreateDemandeDto) {
    return this.demandeService.create(createDemandeDto);
  }

  @Post('upload-files')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true, skipNullProperties: true, skipUndefinedProperties: true }))
  @UseInterceptors(FilesInterceptor('images', 10, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit per file
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.includes('image')) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new demande with images (bypasses global validation)' })
  @ApiResponse({ status: 201, description: 'Demande with images successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createWithImagesUpload(
    @Body() createDemandeDto: CreateDemandeDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    console.log('=== UPLOAD-FILES ENDPOINT ===');
    console.log('Demande data received:', createDemandeDto);
    console.log('Files received:', files ? files.length : 0);
    
    if (files && files.length > 0) {
      console.log('File details:', files.map(f => ({
        fieldname: f.fieldname,
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size
      })));
    }
    
    return this.demandeService.createWithImages(createDemandeDto, files || []);
  }

  @Post('test-upload')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Test endpoint for file uploads' })
  @ApiResponse({ status: 201, description: 'Test successful' })
  async testUpload(
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    console.log('=== TEST UPLOAD ENDPOINT ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Files received:', files ? files.length : 0);
    
    if (files && files.length > 0) {
      console.log('File details:', files.map(f => ({
        fieldname: f.fieldname,
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size
      })));
    }
    
    return {
      message: 'Test upload successful',
      bodyReceived: req.body,
      filesReceived: files ? files.length : 0,
      headers: req.headers
    };
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 10, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit per file
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.includes('image')) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new demande with images (alternative endpoint)' })
  @ApiResponse({ status: 201, description: 'Demande with images successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createWithImagesAlternative(
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    console.log('=== UPLOAD ENDPOINT ===');
    console.log('Request body:', req.body);
    console.log('Files received:', files ? files.length : 0);
    
    if (files && files.length > 0) {
      console.log('File details:', files.map(f => ({
        fieldname: f.fieldname,
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size
      })));
    }
    
    // Parse the form data manually since it comes as raw body
    const formData = req.body;
    const demandeData: CreateDemandeDto = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      propertyType: formData.propertyType,
      propertyLocation: formData.propertyLocation,
      propertyIntention: formData.propertyIntention,
      message: formData.message,
      whatsappContact: formData.whatsappContact === 'true',
      emailContact: formData.emailContact === 'true',
    };
    
    return this.demandeService.createWithImages(demandeData, files || []);
  }

  @Post('with-images')
  @UseInterceptors(FilesInterceptor('images', 10, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit per file
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.includes('image')) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new demande with images' })
  @ApiResponse({ status: 201, description: 'Demande with images successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createWithImages(
    @Req() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
        fileIsRequired: false,
      }),
    ) files: Express.Multer.File[]
  ) {
    console.log('=== WITH-IMAGES ENDPOINT ===');
    console.log('Request body:', req.body);
    console.log('Files received:', files ? files.length : 0);
    
    if (files && files.length > 0) {
      console.log('File details:', files.map(f => ({
        fieldname: f.fieldname,
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size
      })));
    }
    
    // Parse the form data manually since it comes as raw body
    const formData = req.body;
    const demandeData: CreateDemandeDto = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      propertyType: formData.propertyType,
      propertyLocation: formData.propertyLocation,
      propertyIntention: formData.propertyIntention,
      message: formData.message,
      whatsappContact: formData.whatsappContact === 'true',
      emailContact: formData.emailContact === 'true',
    };
    
    return this.demandeService.createWithImages(demandeData, files || []);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all demandes' })
  @ApiResponse({ status: 200, description: 'Return all demandes' })
  findAll() {
    return this.demandeService.findAll();
  }

  @Get('analytics/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics summary for demandes' })
  @ApiResponse({ status: 200, description: 'Return analytics summary' })
  analytics() {
    return this.demandeService.getAnalytics();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a demande by id' })
  @ApiResponse({ status: 200, description: 'Return the demande' })
  @ApiResponse({ status: 404, description: 'Demande not found' })
  findOne(@Param('id') id: string) {
    return this.demandeService.findOne(id);
  }

  @Patch(':id/status/:status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a demande status' })
  @ApiResponse({ status: 200, description: 'Demande status successfully updated' })
  @ApiResponse({ status: 404, description: 'Demande not found' })
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: DemandeStatus,
  ) {
    return this.demandeService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a demande' })
  @ApiResponse({ status: 200, description: 'Demande successfully deleted' })
  @ApiResponse({ status: 404, description: 'Demande not found' })
  remove(@Param('id') id: string) {
    return this.demandeService.remove(id);
  }
}