import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBlogSlugDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}
