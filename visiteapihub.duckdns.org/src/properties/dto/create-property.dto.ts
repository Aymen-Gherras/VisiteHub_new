import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsArray, Min, Max, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { escape } from 'html-escaper';
import { PropertyType, TransactionType } from '../entities/property.entity';

export class CreatePropertyDto {
  @Transform(({ value }) => escape(value?.trim()))
  @IsString()
  @IsNotEmpty()
  title: string;

  @Transform(({ value }) => {
    if (!value) return '';
    // Preserve ALL spaces (including multiple consecutive), newlines, and emojis
    // Only escape HTML to prevent XSS - escape() preserves spaces and emojis
    return escape(value);
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ value, obj }) => {
    // CRITICAL: This Transform MUST preserve the full string value
    // Check the raw value from the object to see what we actually received
    const rawValue = obj?.price !== undefined ? obj.price : value;
    console.log(`🔍 CreatePropertyDto.price Transform - Raw value:`, rawValue, 'Type:', typeof rawValue, 'JSON:', JSON.stringify(rawValue));
    
    if (rawValue === null || rawValue === undefined) {
      return rawValue;
    }
    
    // ALWAYS convert to string - this prevents any number conversion
    // If it's already a string, just trim it
    if (typeof rawValue === 'string') {
      const trimmed = rawValue.trim();
      console.log(`✅ CreatePropertyDto.price Transform - Preserved string:`, trimmed);
      return trimmed;
    }
    
    // If it's a number, convert to string (this means implicit conversion happened)
    if (typeof rawValue === 'number') {
      console.log(`⚠️ CreatePropertyDto.price Transform - Received NUMBER (implicit conversion happened!):`, rawValue);
      // We lost the text part, can't recover it
      return rawValue.toString();
    }
    
    // Force to string for any other type
    const stringValue = String(rawValue);
    console.log(`🔍 CreatePropertyDto.price Transform - Converted to string:`, stringValue);
    return stringValue.trim();
  }, { toClassOnly: true })
  @IsString({ message: 'Price must be a string' })
  @IsNotEmpty()
  price: string;

  @Transform(({ value }) => escape(value?.trim()))
  @IsString()
  @IsNotEmpty()
  address: string;

  @Transform(({ value }) => escape(value?.trim()))
  @IsString()
  @IsNotEmpty()
  daira: string;

  @Transform(({ value }) => escape(value?.trim()))
  @IsString()
  @IsNotEmpty()
  wilaya: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(20)
  bedrooms: number;

  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(20)
  bathrooms?: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  surface: number;

  @IsEnum(PropertyType)
  @IsNotEmpty()
  type: PropertyType;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;

  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  etage?: number;

  @IsString()
  @IsOptional()
  @IsEnum(['month', 'day'])
  rentPeriod?: 'month' | 'day';

  @Transform(({ value }) => escape(value?.trim()))
  @IsString()
  @IsNotEmpty()
  propertyOwnerType: string; // 'Particulier', 'Agence immobilière', 'Promotion immobilière'

  @Transform(({ value }) => {
    if (value === null) return null;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return undefined;
      return escape(trimmed);
    }
    return undefined;
  })
  @IsString()
  @IsOptional()
  propertyOwnerName?: string; // Name of agency or promotion company (only for 'Agence immobilière' or 'Promotion immobilière')

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  iframe360Link?: string;

  @IsString()
  @IsOptional()
  apartmentType?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @Transform(({ value }) => escape(value?.trim()))
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @Transform(({ value }) => escape(value?.trim()))
  @IsString()
  @IsOptional()
  slug?: string;

  @IsArray()
  @IsOptional()
  images?: string[]; // array of /uploads/... paths

  // Backward-compatible alias (deprecated)
  @IsArray()
  @IsOptional()
  imageUrls?: string[];

  @IsString()
  @IsOptional()
  mainImage?: string; // /uploads/... path

  @IsArray()
  @IsOptional()
  papers?: string[]; // array of paper names
}