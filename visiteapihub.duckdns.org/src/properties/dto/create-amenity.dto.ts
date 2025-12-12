import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAmenityDto {
  // Education
  @ApiPropertyOptional({ description: 'Maternal education nearby' })
  @IsOptional()
  @IsBoolean()
  educationMaternal?: boolean;

  @ApiPropertyOptional({ description: 'Primary education nearby' })
  @IsOptional()
  @IsBoolean()
  educationPrimere?: boolean;

  @ApiPropertyOptional({ description: 'College nearby' })
  @IsOptional()
  @IsBoolean()
  educationCollege?: boolean;

  @ApiPropertyOptional({ description: 'High school nearby' })
  @IsOptional()
  @IsBoolean()
  educationLycee?: boolean;

  @ApiPropertyOptional({ description: 'University nearby' })
  @IsOptional()
  @IsBoolean()
  educationUniversite?: boolean;

  @ApiPropertyOptional({ description: 'Leisure space for education nearby' })
  @IsOptional()
  @IsBoolean()
  educationEspaceDeLoisir?: boolean;

  // Medical
  @ApiPropertyOptional({ description: 'Hospital nearby' })
  @IsOptional()
  @IsBoolean()
  medicalsHopital?: boolean;

  @ApiPropertyOptional({ description: 'Pharmacy nearby' })
  @IsOptional()
  @IsBoolean()
  medicalsPharmacie?: boolean;

  @ApiPropertyOptional({ description: 'Clinic nearby' })
  @IsOptional()
  @IsBoolean()
  medicalsClinique?: boolean;

  @ApiPropertyOptional({ description: 'Laboratory nearby' })
  @IsOptional()
  @IsBoolean()
  medicalsLaboratoire?: boolean;

  // Leisure
  @ApiPropertyOptional({ description: 'Park nearby' })
  @IsOptional()
  @IsBoolean()
  loisirParc?: boolean;

  @ApiPropertyOptional({ description: 'Gym nearby' })
  @IsOptional()
  @IsBoolean()
  loisirGym?: boolean;

  @ApiPropertyOptional({ description: 'Library nearby' })
  @IsOptional()
  @IsBoolean()
  loisirBibliotheque?: boolean;

  @ApiPropertyOptional({ description: 'Theatre nearby' })
  @IsOptional()
  @IsBoolean()
  loisirTheatre?: boolean;

  @ApiPropertyOptional({ description: 'Sports fields nearby' })
  @IsOptional()
  @IsBoolean()
  loisirTerrains?: boolean;

  @ApiPropertyOptional({ description: 'Mall nearby' })
  @IsOptional()
  @IsBoolean()
  loisirMall?: boolean;

  // Transport
  @ApiPropertyOptional({ description: 'Bus station nearby' })
  @IsOptional()
  @IsBoolean()
  transportBus?: boolean;

  @ApiPropertyOptional({ description: 'Tramway nearby' })
  @IsOptional()
  @IsBoolean()
  transportTrameway?: boolean;

  @ApiPropertyOptional({ description: 'Metro nearby' })
  @IsOptional()
  @IsBoolean()
  transportMetro?: boolean;

  @ApiPropertyOptional({ description: 'Train station nearby' })
  @IsOptional()
  @IsBoolean()
  transportTrain?: boolean;

  // Internal
  @ApiPropertyOptional({ description: 'Parking available' })
  @IsOptional()
  @IsBoolean()
  internParking?: boolean;

  @ApiPropertyOptional({ description: 'Individual garage available' })
  @IsOptional()
  @IsBoolean()
  internGarageIndividuel?: boolean;

  @ApiPropertyOptional({ description: 'Collective parking available' })
  @IsOptional()
  @IsBoolean()
  internParkingCollectif?: boolean;

  @ApiPropertyOptional({ description: 'Garden available' })
  @IsOptional()
  @IsBoolean()
  internJardin?: boolean;

  @ApiPropertyOptional({ description: 'Swimming pool available' })
  @IsOptional()
  @IsBoolean()
  internPiscine?: boolean;

  @ApiPropertyOptional({ description: 'Leisure facilities available' })
  @IsOptional()
  @IsBoolean()
  internLoisir?: boolean;

  @ApiPropertyOptional({ description: 'Safety features available' })
  @IsOptional()
  @IsBoolean()
  internSafe?: boolean;

  @ApiPropertyOptional({ description: 'Security cameras available' })
  @IsOptional()
  @IsBoolean()
  internCamera?: boolean;

  @ApiPropertyOptional({ description: 'Police nearby' })
  @IsOptional()
  @IsBoolean()
  internPolice?: boolean;

  @ApiPropertyOptional({ description: 'Infirmary available' })
  @IsOptional()
  @IsBoolean()
  internInfirmerie?: boolean;

  @ApiPropertyOptional({ description: 'Elevators available' })
  @IsOptional()
  @IsBoolean()
  internAscenseurs?: boolean;

  @ApiPropertyOptional({ description: 'Gym available' })
  @IsOptional()
  @IsBoolean()
  internGym?: boolean;

  @ApiPropertyOptional({ description: 'Additional description of amenities' })
  @IsOptional()
  @IsString()
  descriptionAccomodité?: string;
}