import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsOptional()
  listingId?: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
