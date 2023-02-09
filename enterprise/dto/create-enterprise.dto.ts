import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AdminCreateCompanyAddressDto } from './admincompanyaddress.dto';

export class CreateEnterpriseDto {
  companyName: string;
  workPhone: string;
  block: boolean;

  @ValidateNested()
  @Type(() => AdminCreateCompanyAddressDto)
  address: AdminCreateCompanyAddressDto;
}
